import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserCreatedEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: ClerkEmailAddress[];
    primary_email_address_id: string;
    deleted?: boolean;
  };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Verificar firma del webhook con svix
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  let event: ClerkUserCreatedEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch (error: unknown) {
    console.error("Clerk webhook verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = createServiceClient();

  try {
    if (event.type === "user.created") {
      const { id, email_addresses, primary_email_address_id } = event.data;

      const primaryEmail = email_addresses.find(
        (e) => e.id === primary_email_address_id
      )?.email_address ?? email_addresses[0]?.email_address;

      if (!primaryEmail) {
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }

      // Crear usuario en Supabase
      const { error } = await db.from("users").upsert(
        { id, email: primaryEmail },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Error inserting user in Supabase:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`User created in Supabase: ${id} — ${primaryEmail}`);
    }

    if (event.type === "user.updated") {
      const { id, email_addresses, primary_email_address_id } = event.data;

      const primaryEmail = email_addresses.find(
        (e) => e.id === primary_email_address_id
      )?.email_address ?? email_addresses[0]?.email_address;

      if (primaryEmail) {
        await db.from("users").update({ email: primaryEmail }).eq("id", id);
      }
    }

    if (event.type === "user.deleted") {
      const { id } = event.data;
      // ON DELETE CASCADE en subscriptions y dialogues elimina registros hijos
      await db.from("users").delete().eq("id", id);
      console.log(`User deleted from Supabase: ${id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Clerk webhook handler error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
