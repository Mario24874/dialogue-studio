import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe, APP_URL } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = createServiceClient();
    const { data: user } = await db
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json({ error: "No customer found" }, { status: 404 });
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${APP_URL}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear sesión" },
      { status: 500 }
    );
  }
}
