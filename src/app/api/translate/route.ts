import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkQuota, incrementUsage } from "@/lib/quota";
import { type DialogueType, DIALOGUE_EXAMPLES, DIALOGUE_TYPE_STYLE_NOTES } from "@/lib/dialogue-examples";

export const dynamic = "force-dynamic";

interface Character { id: string; name: string; gender: "M" | "F" }

// Prompt compartido por ambos proveedores
function buildPrompt(
  text: string,
  sourceLang: string,
  characters: Character[],
  dialogueType?: DialogueType
): string {
  const langName = sourceLang === "es" ? "español" : "inglés";
  const charList = characters
    .map((c, i) => `${String.fromCharCode(65 + i)}: ${c.name}`)
    .join(", ");

  const styleBlock = dialogueType ? `
ESTILO DEL DIÁLOGO: ${dialogueType.toUpperCase()}
${DIALOGUE_TYPE_STYLE_NOTES[dialogueType]}

EJEMPLO DE REFERENCIA (sigue este estilo):
${DIALOGUE_EXAMPLES[dialogueType]}
` : "";

  return `Eres un experto en traducción al italiano natural y coloquial.

El siguiente diálogo está en ${langName}. Tradúcelo al italiano natural, manteniendo el tono conversacional.
${styleBlock}
PERSONAJES (usa estos nombres exactamente en el resultado):
${charList}

DIÁLOGO ORIGINAL:
${text}

INSTRUCCIONES IMPORTANTES:
1. Traduce cada línea al italiano${dialogueType ? ` usando el estilo ${dialogueType}` : " natural y coloquial"}.
2. Identifica qué personaje (A, B, C...) habla en cada línea del original.
3. Usa el nombre real del personaje (no la letra) en la respuesta.
4. Devuelve ÚNICAMENTE un JSON válido con este formato, sin texto adicional:
{
  "lines": [
    { "name": "NombrePersonaje", "text": "texto en italiano" },
    { "name": "OtroPersonaje", "text": "texto en italiano" }
  ]
}
5. NO incluyas explicaciones, comentarios ni nada fuera del JSON.
6. El italiano debe ser natural, como hablaría un nativo.`;
}

function parseTranslationJson(raw: string) {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("La IA no devolvió un formato válido. Intenta de nuevo.");
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.lines || !Array.isArray(parsed.lines) || parsed.lines.length === 0) {
    throw new Error("No se encontraron líneas de diálogo en la traducción.");
  }
  return parsed;
}

// ─── PROVEEDOR: Gemini (actual — testing con capa gratuita) ──────────────────
// Prueba gemini-3-flash-preview primero; si hay cuota agotada (429) cae a versiones anteriores.
// Producción: reemplazar por Claude Haiku agregando ANTHROPIC_API_KEY en Netlify.
async function translateWithGemini(
  text: string,
  sourceLang: string,
  characters: Character[],
  dialogueType?: DialogueType
) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const prompt = buildPrompt(text, sourceLang, characters, dialogueType);

  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-3-flash-preview"];
  let lastError: unknown;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return parseTranslationJson(result.response.text());
    } catch (err: unknown) {
      lastError = err;
      // Siempre intenta el siguiente modelo (cuota, model not found, etc.)
    }
  }

  throw lastError;
}

// ─── PROVEEDOR: Claude Haiku (futuro — producción en VPS) ────────────────────
async function translateWithClaude(
  text: string,
  sourceLang: string,
  characters: Character[],
  dialogueType?: DialogueType
) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = buildPrompt(text, sourceLang, characters, dialogueType);
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const rawContent = message.content[0].type === "text" ? message.content[0].text : "";
  return parseTranslationJson(rawContent);
}

// ─── MODO MOCK: pruebas sin consumir APIs ─────────────────────────────────────
function buildMockResponse(characters: Character[], text: string) {
  const inputLines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const mockPhrases = [
    "Buongiorno! Come stai oggi?",
    "Molto bene, grazie! E tu?",
    "Benissimo. Andiamo al bar a prendere un caffè?",
    "Sì, volentieri! Ho bisogno di un caffè.",
    "Perfetto. Conosco un posto ottimo qui vicino.",
    "Ottima idea! Ci andiamo subito.",
    "Hai già fatto colazione stamattina?",
    "No, non ancora. Prenderò un cornetto.",
    "Anch'io. Mi piacciono molto i cornetti alla crema.",
    "Sì, sono deliziosi! Andiamo.",
  ];
  return {
    lines: inputLines.map((_, i) => ({
      name: characters[i % characters.length].name,
      text: mockPhrases[i % mockPhrases.length],
    })),
  };
}

// ─── Handler principal ────────────────────────────────────────────────────────
// Proveedor activo según env vars disponibles:
//   GEMINI_API_KEY       → Gemini 2.0 Flash (gratuito, actual)
//   ANTHROPIC_API_KEY    → Claude Haiku (producción futura en VPS)
//   TRANSLATION_MODE=mock → respuestas mock sin consumir API
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

    const { text, sourceLang, characters, dialogueType }: {
      text: string;
      sourceLang: "es" | "en";
      characters: Character[];
      dialogueType?: DialogueType;
    } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "El texto no puede estar vacío" }, { status: 400 });
    }
    if (!characters || characters.length < 2) {
      return NextResponse.json({ error: "Se necesitan al menos 2 personajes" }, { status: 400 });
    }

    let result;
    if (process.env.TRANSLATION_MODE === "mock") {
      result = buildMockResponse(characters, text);
    } else if (process.env.ANTHROPIC_API_KEY) {
      result = await translateWithClaude(text, sourceLang, characters, dialogueType);
    } else if (process.env.GEMINI_API_KEY) {
      result = await translateWithGemini(text, sourceLang, characters, dialogueType);
    } else {
      return NextResponse.json(
        { error: "No hay proveedor de traducción configurado (GEMINI_API_KEY o ANTHROPIC_API_KEY)." },
        { status: 500 }
      );
    }

    await incrementUsage(userId, "dialogue");
    return NextResponse.json({ lines: result.lines });

  } catch (error: unknown) {
    console.error("Translate API error:", error);
    const msg = error instanceof Error ? error.message : "";
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
    return NextResponse.json(
      { error: isQuota
          ? "Límite de traducciones alcanzado. Por favor intenta de nuevo en unos minutos."
          : (msg || "Error en la traducción") },
      { status: isQuota ? 429 : 500 }
    );
  }
}
