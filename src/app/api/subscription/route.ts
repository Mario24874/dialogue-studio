import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ active: false }, { status: 401 });
    }

    const db = createServiceClient();
    const { data } = await db
      .from("subscriptions")
      .select("status, current_period_end, cancel_at_period_end, plan_type, dialogues_used_this_month, audio_used_this_month")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      active: !!data,
      status: data?.status ?? null,
      period_end: data?.current_period_end ?? null,
      cancel_at_period_end: data?.cancel_at_period_end ?? false,
      plan_type: data?.plan_type ?? null,
      dialogues_used: data?.dialogues_used_this_month ?? 0,
      audio_used: data?.audio_used_this_month ?? 0,
    });
  } catch {
    return NextResponse.json({ active: false });
  }
}
