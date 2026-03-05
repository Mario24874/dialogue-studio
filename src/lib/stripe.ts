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

// Mapeo product_id → plan_type (evaluado en runtime, no en build)
export function productToPlanType(productId: string): "basic" | "standard" | "pro" | null {
  if (productId === process.env.STRIPE_PRODUCT_ID_BASIC) return "basic";
  if (productId === process.env.STRIPE_PRODUCT_ID_STANDARD) return "standard";
  if (productId === process.env.STRIPE_PRODUCT_ID_PRO) return "pro";
  return null;
}

// Todos los price IDs válidos (evaluado en runtime)
export function getValidPriceIds(): string[] {
  return [
    process.env.STRIPE_PRICE_ID_BASIC    || process.env.STRIPE_PRICE_ID_MONTHLY,
    process.env.STRIPE_PRICE_ID_BASIC_ANNUAL || process.env.STRIPE_PRICE_ID_ANNUAL,
    process.env.STRIPE_PRICE_ID_STANDARD_MONTHLY,
    process.env.STRIPE_PRICE_ID_STANDARD_ANNUAL,
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
    process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
  ].filter((id): id is string => !!id);
}

// Precio por defecto (backward compat con código antiguo si hubiera)
export const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_ID_BASIC!;
export const STRIPE_PRICE_ANNUAL = process.env.STRIPE_PRICE_ID_BASIC_ANNUAL!;
