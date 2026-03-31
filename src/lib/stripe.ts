import Stripe from "stripe";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Lazy singleton
let _stripe: Stripe | undefined;
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Mapeo product_id → plan_type — productos del Stripe unificado de italianto.com
export function productToPlanType(productId: string): "essenziale" | "avanzato" | "maestro" | null {
  if (productId === process.env.STRIPE_PRODUCT_ESSENZIALE) return "essenziale";
  if (productId === process.env.STRIPE_PRODUCT_AVANZATO)   return "avanzato";
  if (productId === process.env.STRIPE_PRODUCT_MAESTRO)    return "maestro";
  return null;
}

// Todos los price IDs válidos (evaluado en runtime)
export function getValidPriceIds(): string[] {
  return [
    process.env.STRIPE_PRICE_ESSENZIALE_MONTHLY,
    process.env.STRIPE_PRICE_ESSENZIALE_ANNUAL,
    process.env.STRIPE_PRICE_AVANZATO_MONTHLY,
    process.env.STRIPE_PRICE_AVANZATO_ANNUAL,
    process.env.STRIPE_PRICE_MAESTRO_MONTHLY,
    process.env.STRIPE_PRICE_MAESTRO_ANNUAL,
  ].filter((id): id is string => !!id);
}
