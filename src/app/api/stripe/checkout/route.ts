import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getStripe, getValidPriceIds, APP_URL } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const planId: string = body.planId ?? "basic";
    // Backward compat: body.plan="annual" (old subscribe page)
    const billing: string =
      body.billing === "annual" || body.plan === "annual" ? "annual" : "monthly";

    const priceMap: Record<string, Record<string, string | undefined>> = {
      basic:    { monthly: process.env.STRIPE_PRICE_ID_BASIC,            annual: process.env.STRIPE_PRICE_ID_BASIC_ANNUAL },
      standard: { monthly: process.env.STRIPE_PRICE_ID_STANDARD_MONTHLY, annual: process.env.STRIPE_PRICE_ID_STANDARD_ANNUAL },
      pro:      { monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,       annual: process.env.STRIPE_PRICE_ID_PRO_ANNUAL },
    };

    const priceId = priceMap[planId]?.[billing];
    if (!priceId || !getValidPriceIds().includes(priceId)) {
      return NextResponse.json({ error: "Plan no válido" }, { status: 400 });
    }

    const db = createServiceClient();

    // Obtener o crear usuario en Supabase
    const { data: user } = await db
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", userId)
      .single();

    let stripeCustomerId = user?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Obtener email desde Clerk si el usuario no existe aún en Supabase
      const { clerkClient } = await import("@clerk/nextjs/server");
      const clerkUser = await (await clerkClient()).users.getUser(userId);
      const email =
        clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

      // Upsert: crea el usuario si no existe (por si el webhook de Clerk tardó)
      await db
        .from("users")
        .upsert({ id: userId, email: email ?? "" }, { onConflict: "id" });

      const customer = await getStripe().customers.create({
        metadata: { clerk_user_id: userId },
        email: email,
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
      metadata: { clerk_user_id: userId, plan_id: planId, billing },
      subscription_data: {
        metadata: { clerk_user_id: userId, plan_id: planId, billing },
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
