import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_ANNUAL, APP_URL } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Leer plan elegido por el usuario ("monthly" | "annual"), default monthly
    const body = await req.json().catch(() => ({}));
    const plan: "monthly" | "annual" = body.plan === "annual" ? "annual" : "monthly";
    const priceId = plan === "annual" ? STRIPE_PRICE_ANNUAL : STRIPE_PRICE_MONTHLY;

    const db = createServiceClient();

    // Obtener o crear usuario en Supabase
    const { data: user } = await db
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", userId)
      .single();

    let stripeCustomerId = user?.stripe_customer_id;

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
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/studio?subscribed=true`,
      cancel_url: `${APP_URL}/pricing?canceled=true`,
      metadata: { clerk_user_id: userId, plan },
      subscription_data: {
        metadata: { clerk_user_id: userId, plan },
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
