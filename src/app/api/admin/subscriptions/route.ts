import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";

  const db = createServiceClient();
  let query = db
    .from("subscriptions")
    .select(
      "id, status, price_id, current_period_start, current_period_end, cancel_at_period_end, created_at, users(email)"
    )
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ subscriptions: data });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as { id?: string; action?: string };
  const { id, action } = body;

  if (!id || action !== "cancel") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await getStripe().subscriptions.cancel(id);

  const db = createServiceClient();
  await db.from("subscriptions").update({ status: "canceled" }).eq("id", id);

  return NextResponse.json({ success: true });
}
