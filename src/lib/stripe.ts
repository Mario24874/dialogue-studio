import Stripe from "stripe";

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Lazy singleton — no instanciar al importar el módulo (falla en build sin env vars)
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
