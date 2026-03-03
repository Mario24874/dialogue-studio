import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Character { id: string; name: string; gender: "M" | "F" }

// Verifica que el usuario tiene suscripción activa
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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar suscripción activa
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

    const langName = sourceLang === "es" ? "español" : "inglés";
    const charList = characters
      .map((c, i) => `${String.fromCharCode(65 + i)}: ${c.name}`)
      .join(", ");

    // Prompt para Claude: traducción al italiano con nombres reales
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

    // Extraer JSON de la respuesta
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("La IA no devolvió un formato válido. Intenta de nuevo.");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.lines || !Array.isArray(parsed.lines) || parsed.lines.length === 0) {
      throw new Error("No se encontraron líneas de diálogo en la traducción.");
    }

    return NextResponse.json({ lines: parsed.lines });

  } catch (error: any) {
    console.error("Translate API error:", error);
    return NextResponse.json(
      { error: error.message || "Error en la traducción" },
      { status: 500 }
    );
  }
}
