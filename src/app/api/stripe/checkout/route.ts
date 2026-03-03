import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_ID, APP_URL } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const db = createServiceClient();

    // Obtener o crear usuario en Supabase
    const { data: user } = await db
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", userId)
      .single();

    let stripeCustomerId = user?.stripe_customer_id;

    // Si no tiene customer en Stripe, crearlo
    if (!stripeCustomerId) {
      const { data: clerkUser } = await db
        .from("users")
        .select("email")
        .eq("id", userId)
        .single();

      const customer = await getStripe().customers.create({
        metadata: { clerk_user_id: userId },
        email: clerkUser?.email,
      });
      stripeCustomerId = customer.id;

      await db
        .from("users")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", userId);
    }

    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${APP_URL}/studio?subscribed=true`,
      cancel_url: `${APP_URL}/pricing?canceled=true`,
      // clerk_user_id en metadata de la sesión (disponible en webhook)
      metadata: { clerk_user_id: userId },
      subscription_data: {
        metadata: { clerk_user_id: userId },
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
