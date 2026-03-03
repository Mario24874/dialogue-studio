import Stripe from "stripe";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// IDs de precio por plan
export const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_ID_MONTHLY!;
export const STRIPE_PRICE_ANNUAL = process.env.STRIPE_PRICE_ID_ANNUAL!;

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
