import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkQuota, incrementUsage } from "@/lib/quota";
import { type DialogueType, DIALOGUE_TYPE_STYLE_NOTES } from "@/lib/dialogue-examples";

export const dynamic = "force-dynamic";

interface Character { id: string; name: string; gender: "M" | "F" }

// ─── Prompt de generación directa en italiano ─────────────────────────────────
function buildGeneratePrompt(
  context: string,
  dialogueType: DialogueType,
  characters: Character[],
  turnCount: number
): string {
  const charList = characters.map((c) => c.name).join(", ");
  const styleNote = DIALOGUE_TYPE_STYLE_NOTES[dialogueType];

  return `Sei un esperto di italiano naturale e dialoghi autentici.

Crea un dialogo in italiano tra i seguenti personaggi: ${charList}.

CONTESTO: ${context}

STILE: ${dialogueType.toUpperCase()}
${styleNote}

REQUISITI:
1. Il dialogo deve avere esattamente ${turnCount} interventi totali, distribuiti tra i personaggi in modo alternato.
2. Ogni intervento deve avere massimo 2 frasi brevi e naturali — tieni ogni frase concisa.
3. Il dialogo deve essere fluido, coerente con il contesto indicato e autentico.
4. Usa il nome reale del personaggio (non lettere come A, B).
5. Restituisci UNICAMENTE un JSON valido, senza testo aggiuntivo:
{
  "lines": [
    { "name": "NomePersonaggio", "text": "testo in italiano" },
    { "name": "AltroPersonaggio", "text": "testo in italiano" }
  ]
}
6. NON includere spiegazioni, commenti o testo fuori dal JSON.`;
}

function parseJson(raw: string) {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("La IA no devolvió un formato válido. Intenta de nuevo.");
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.lines || !Array.isArray(parsed.lines) || parsed.lines.length === 0) {
    throw new Error("No se encontraron líneas de diálogo en la respuesta.");
  }
  return parsed;
}

// ─── Mock ─────────────────────────────────────────────────────────────────────
function buildMockResponse(characters: Character[], turnCount: number) {
  const mockPhrases = [
    "Ciao! Come posso aiutarti oggi?",
    "Buongiorno! Ho bisogno di alcune informazioni.",
    "Certamente, sono a sua disposizione.",
    "Grazie mille per la disponibilità.",
    "Di cosa si tratta esattamente?",
    "Vorrei sapere di più su questo argomento.",
    "Capisco. Le spiego subito come funziona.",
    "Perfetto, la ascolto con attenzione.",
    "Ottima idea, procediamo pure.",
    "Bene, allora ci vediamo dopo.",
  ];
  return {
    lines: Array.from({ length: turnCount }, (_, i) => ({
      name: characters[i % characters.length].name,
      text: mockPhrases[i % mockPhrases.length],
    })),
  };
}

// ─── Gemini ───────────────────────────────────────────────────────────────────
async function generateWithGemini(
  context: string,
  dialogueType: DialogueType,
  characters: Character[],
  turnCount: number
) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const prompt = buildGeneratePrompt(context, dialogueType, characters, turnCount);

  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-3-flash-preview"];
  let lastError: unknown;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return parseJson(result.response.text());
    } catch (err: unknown) {
      lastError = err;
    }
  }
  throw lastError;
}

// ─── Claude Haiku ─────────────────────────────────────────────────────────────
async function generateWithClaude(
  context: string,
  dialogueType: DialogueType,
  characters: Character[],
  turnCount: number
) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildGeneratePrompt(context, dialogueType, characters, turnCount);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const rawContent = message.content[0].type === "text" ? message.content[0].text : "";
  return parseJson(rawContent);
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const quota = await checkQuota(userId, "dialogue");
    if (!quota.subscribed) {
      return NextResponse.json(
        { error: "Suscripción requerida. Por favor suscríbete para usar esta función." },
        { status: 403 }
      );
    }
    if (!quota.allowed) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de diálogos de tu plan (${quota.used}/${quota.limit}). Actualiza tu plan para continuar.` },
        { status: 403 }
      );
    }

    const { context, dialogueType, characters, turnCount }: {
      context: string;
      dialogueType: DialogueType;
      characters: Character[];
      turnCount: number;
    } = await req.json();

    if (!context?.trim()) {
      return NextResponse.json({ error: "El contexto no puede estar vacío" }, { status: 400 });
    }
    if (!dialogueType) {
      return NextResponse.json({ error: "Selecciona un tipo de diálogo" }, { status: 400 });
    }
    if (!characters || characters.length < 2) {
      return NextResponse.json({ error: "Se necesitan al menos 2 personajes" }, { status: 400 });
    }

    let result;
    if (process.env.TRANSLATION_MODE === "mock") {
      result = buildMockResponse(characters, turnCount ?? 6);
    } else if (process.env.ANTHROPIC_API_KEY) {
      result = await generateWithClaude(context, dialogueType, characters, turnCount ?? 6);
    } else if (process.env.GEMINI_API_KEY) {
      result = await generateWithGemini(context, dialogueType, characters, turnCount ?? 6);
    } else {
      return NextResponse.json(
        { error: "No hay proveedor de IA configurado (GEMINI_API_KEY o ANTHROPIC_API_KEY)." },
        { status: 500 }
      );
    }

    await incrementUsage(userId, "dialogue");
    return NextResponse.json({ lines: result.lines });

  } catch (error: unknown) {
    console.error("Generate dialogue API error:", error);
    const msg = error instanceof Error ? error.message : "";
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
    return NextResponse.json(
      {
        error: isQuota
          ? "Límite de generaciones alcanzado. Por favor intenta de nuevo en unos minutos."
          : (msg || "Error al generar el diálogo"),
      },
      { status: isQuota ? 429 : 500 }
    );
  }
}
