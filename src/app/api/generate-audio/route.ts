import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

interface DialogueLine { name: string; text: string }
interface Character { id: string; name: string; gender: "M" | "F"; voiceId: string }

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

async function generateSpeech(text: string, voiceId: string): Promise<Uint8Array> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err.slice(0, 200)}`);
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

// Frame de silencio MP3 (~0.5s) para separar líneas
const SILENCE_FRAME = new Uint8Array([
  0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

function combineAudio(segments: Uint8Array[]): Uint8Array {
  const totalLength = segments.reduce((sum, s) => sum + s.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const seg of segments) {
    combined.set(seg, offset);
    offset += seg.length;
  }
  return combined;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const subscribed = await hasActiveSubscription(userId);
    if (!subscribed) {
      return NextResponse.json(
        { error: "Suscripción requerida para generar audio." },
        { status: 403 }
      );
    }

    const { lines, characters }: { lines: DialogueLine[]; characters: Character[] } = await req.json();

    if (!lines || lines.length === 0) {
      return NextResponse.json({ error: "No hay líneas de diálogo" }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key no configurada" },
        { status: 500 }
      );
    }

    // Mapear nombre → voiceId
    const voiceMap: Record<string, string> = {};
    for (const char of characters) {
      voiceMap[char.name] = char.voiceId;
    }

    const segments: Uint8Array[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const voiceId = voiceMap[line.name];

      if (!voiceId) {
        console.warn(`No se encontró voz para: ${line.name}`);
        continue;
      }

      const audioData = await generateSpeech(line.text, voiceId);
      segments.push(audioData);

      // Silencio entre líneas (no después de la última)
      if (i < lines.length - 1) {
        segments.push(SILENCE_FRAME);
      }
    }

    if (segments.length === 0) {
      return NextResponse.json(
        { error: "No se pudo generar audio para ninguna línea" },
        { status: 500 }
      );
    }

    const finalAudio = combineAudio(segments);
    const audioBase64 = Buffer.from(finalAudio).toString("base64");

    return NextResponse.json({
      audioContent: audioBase64,
      lines: lines.length,
    });

  } catch (error: any) {
    console.error("Generate audio error:", error);
    return NextResponse.json(
      { error: error.message || "Error generando el audio" },
      { status: 500 }
    );
  }
}
