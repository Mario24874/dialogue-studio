import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { isAdmin } from "@/lib/admin";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const stripe = getStripe();
  const [coupons, promoCodes] = await Promise.all([
    stripe.coupons.list({ limit: 100 }),
    stripe.promotionCodes.list({ limit: 100, active: true }),
  ]);

  // Map promo codes to their coupon IDs
  const promoByCode: Record<string, string[]> = {};
  for (const promo of promoCodes.data) {
    const cpId = typeof promo.coupon === "string" ? promo.coupon : promo.coupon.id;
    if (!promoByCode[cpId]) promoByCode[cpId] = [];
    promoByCode[cpId].push(promo.code);
  }

  const result = coupons.data.map((cp) => ({
    id: cp.id,
    name: cp.name,
    percent_off: cp.percent_off,
    duration: cp.duration,
    duration_in_months: cp.duration_in_months,
    max_redemptions: cp.max_redemptions,
    times_redeemed: cp.times_redeemed,
    valid: cp.valid,
    promo_codes: promoByCode[cp.id] ?? [],
  }));

  return NextResponse.json({ coupons: result });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    name?: string;
    percent_off?: number;
    duration?: string;
    duration_in_months?: number;
    max_redemptions?: number;
    code?: string;
  };
  const { name, percent_off, duration, duration_in_months, max_redemptions, code } = body;

  if (!name || !percent_off || !duration) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const stripe = getStripe();

  const couponParams: Stripe.CouponCreateParams = {
    name,
    percent_off: Number(percent_off),
    duration: duration as Stripe.CouponCreateParams.Duration,
    ...(duration === "repeating" && duration_in_months
      ? { duration_in_months: Number(duration_in_months) }
      : {}),
    ...(max_redemptions ? { max_redemptions: Number(max_redemptions) } : {}),
  };

  const coupon = await stripe.coupons.create(couponParams);

  const promoCode = code ?? name.toUpperCase().replace(/\s+/g, "_");
  const promo = await stripe.promotionCodes.create({
    coupon: coupon.id,
    code: promoCode,
    ...(max_redemptions ? { max_redemptions: Number(max_redemptions) } : {}),
  });

  return NextResponse.json({ coupon, promo_code: promo.code });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await getStripe().coupons.del(id);

  return NextResponse.json({ success: true });
}
