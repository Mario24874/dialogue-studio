import { createServiceClient } from "@/lib/supabase";

export type PlanType = "essenziale" | "avanzato" | "maestro";

export interface PlanLimits {
  dialogues: number; // -1 = unlimited
  audio: number;     // -1 = unlimited
}

export function getPlanLimits(planType: PlanType): PlanLimits {
  switch (planType) {
    case "essenziale": return { dialogues: 20, audio: 2 };
    case "avanzato":   return { dialogues: 80, audio: 30 };
    case "maestro":    return { dialogues: -1, audio: -1 };
  }
}

export interface QuotaStatus {
  subscribed: boolean;
  allowed: boolean;
  used: number;
  limit: number;
  planType: PlanType | null;
}

export async function checkQuota(
  userId: string,
  type: "dialogue" | "audio"
): Promise<QuotaStatus> {
  const db = createServiceClient();
  const { data } = await db
    .from("subscriptions")
    .select("status, plan_type, dialogues_used, audio_used")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return { subscribed: false, allowed: false, used: 0, limit: 0, planType: null };
  }

  const planType = (data.plan_type as PlanType) ?? "essenziale";
  const limits = getPlanLimits(planType);
  const limit = type === "dialogue" ? limits.dialogues : limits.audio;
  const used = type === "dialogue"
    ? ((data.dialogues_used as number) ?? 0)
    : ((data.audio_used as number) ?? 0);

  const allowed = limit === -1 || used < limit;
  return { subscribed: true, allowed, used, limit, planType };
}

export async function incrementUsage(
  userId: string,
  type: "dialogue" | "audio"
): Promise<void> {
  const db = createServiceClient();
  await db.rpc("increment_quota", { p_user_id: userId, p_type: type });
}
