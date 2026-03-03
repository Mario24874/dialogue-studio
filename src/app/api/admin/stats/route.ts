import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createServiceClient();

  const [usersRes, subsRes, dialoguesRes] = await Promise.all([
    db.from("users").select("id", { count: "exact", head: true }),
    db.from("subscriptions").select("status, created_at"),
    db.from("dialogues").select("id", { count: "exact", head: true }),
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const subs = subsRes.data ?? [];
  const activeSubs = subs.filter((s) => s.status === "active" || s.status === "trialing");
  const canceledSubs = subs.filter((s) => s.status === "canceled");
  const newSubsThisMonth = subs.filter((s) => s.created_at >= startOfMonth);

  return NextResponse.json({
    totalUsers: usersRes.count ?? 0,
    activeSubscriptions: activeSubs.length,
    canceledSubscriptions: canceledSubs.length,
    newSubscriptionsThisMonth: newSubsThisMonth.length,
    totalDialogues: dialoguesRes.count ?? 0,
  });
}
