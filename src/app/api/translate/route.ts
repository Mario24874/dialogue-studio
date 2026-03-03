import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

interface Character { id: string; name: string; gender: "M" | "F" }

async function hasActiveSubscription(userId: string): Promise<boolean> {
  const db = createServiceClient();
  const { data } = await db
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .limit(1)
    .single();
  return !!data;
}

// ─── MODO MOCK: respuesta de prueba sin consumir API de Claude ───────────────
// Activo cuando TRANSLATION_MODE=mock en .env.local
// Genera líneas alternando entre los personajes con frases italianas de ejemplo
function buildMockResponse(characters: Character[], text: string) {
  const inputLines = text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

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

  const lines = inputLines.map((_, i) => ({
    name: characters[i % characters.length].name,
    text: mockPhrases[i % mockPhrases.length],
  }));

  return { lines };
}

// ─── MODO LIVE: traducción real con Claude Haiku ─────────────────────────────
async function translateWithClaude(
  text: string,
  sourceLang: string,
  characters: Character[]
) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const langName = sourceLang === "es" ? "español" : "inglés";
  const charList = characters
    .map((c, i) => `${String.fromCharCode(65 + i)}: ${c.name}`)
    .join(", ");

  const prompt = `Eres un experto en traducción al italiano natural y coloquial.

El siguiente diálogo está en ${langName}. Tradúcelo al italiano natural, manteniendo el tono conversacional.

PERSONAJES (usa estos nombres exactamente en el resultado):
${charList}

DIÁLOGO ORIGINAL:
${text}

INSTRUCCIONES IMPORTANTES:
1. Traduce cada línea al italiano natural y coloquial.
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

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const rawContent = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("La IA no devolvió un formato válido. Intenta de nuevo.");

  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.lines || !Array.isArray(parsed.lines) || parsed.lines.length === 0) {
    throw new Error("No se encontraron líneas de diálogo en la traducción.");
  }
  return parsed;
}

// ─── Handler principal ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const subscribed = await hasActiveSubscription(userId);
    if (!subscribed) {
      return NextResponse.json(
        { error: "Suscripción requerida. Por favor suscríbete para usar esta función." },
        { status: 403 }
      );
    }

    const { text, sourceLang, characters }: {
      text: string;
      sourceLang: "es" | "en";
      characters: Character[];
    } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "El texto no puede estar vacío" }, { status: 400 });
    }
    if (!characters || characters.length < 2) {
      return NextResponse.json({ error: "Se necesitan al menos 2 personajes" }, { status: 400 });
    }

    const isMock = process.env.TRANSLATION_MODE === "mock";

    const result = isMock
      ? buildMockResponse(characters, text)
      : await translateWithClaude(text, sourceLang, characters);

    return NextResponse.json({
      lines: result.lines,
      ...(isMock && { _mock: true }), // indica en la respuesta que es mock
    });

  } catch (error: any) {
    console.error("Translate API error:", error);
    return NextResponse.json(
      { error: error.message || "Error en la traducción" },
      { status: 500 }
    );
  }
}
