"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, BarChart2, CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { getPlanLimits, type PlanType } from "@/lib/quota";

type SubData = {
  active: boolean;
  plan_type: PlanType | null;
  dialogues_used: number;
  audio_used: number;
  period_end: string | null;
  cancel_at_period_end: boolean;
};

function ProgressBar({ used, limit }: { used: number; limit: number }) {
  if (limit === -1) return null;
  const pct = Math.min(Math.round((used / limit) * 100), 100);
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-italianto-600";
  return (
    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mt-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const PLAN_COLORS: Record<PlanType, string> = {
  basic: "bg-gray-100 text-gray-700",
  standard: "bg-italianto-100 text-italianto-800",
  pro: "bg-purple-100 text-purple-800",
};

export default function AccountPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [sub, setSub] = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => {
        if (r.status === 401) { router.push("/sign-in"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setSub(data); })
      .finally(() => setLoading(false));
  }, [router]);

  const openPortal = async () => {
    setPortalLoading(true);
    setPortalError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error ?? t("account.portalError"));
      }
    } catch {
      setPortalError(t("account.portalError"));
    } finally {
      setPortalLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-lg mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("account.title")}</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-gray-400" />
            </div>
          ) : !sub?.active ? (
            /* Sin suscripción */
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center">
              <Sparkles size={36} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-400 mb-6">{t("account.noSub")}</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-italianto-800 text-white font-semibold rounded-xl hover:bg-italianto-900 transition-colors"
              >
                {t("account.subscribe")}
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Plan activo */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={16} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                    {t("account.plan")}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${PLAN_COLORS[sub.plan_type ?? "basic"]}`}>
                    {t(`plans.${sub.plan_type ?? "basic"}.name`)}
                  </span>
                  {sub.cancel_at_period_end && (
                    <span className="text-xs text-red-500 font-medium">{t("account.canceling")}</span>
                  )}
                </div>
              </div>

              {/* Uso este mes */}
              {(() => {
                const limits = getPlanLimits(sub.plan_type ?? "basic");
                const dUnlimited = limits.dialogues === -1;
                const aUnlimited = limits.audio === -1;
                return (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                        {t("account.usage")}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {/* Diálogos */}
                      <div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-slate-300">{t("account.dialogues")}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {dUnlimited
                              ? `${sub.dialogues_used} / ${t("account.unlimited")}`
                              : `${sub.dialogues_used} / ${limits.dialogues}`}
                          </span>
                        </div>
                        {!dUnlimited && <ProgressBar used={sub.dialogues_used} limit={limits.dialogues} />}
                      </div>
                      {/* Audio */}
                      <div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-slate-300">{t("account.audio")}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {aUnlimited
                              ? `${sub.audio_used} / ${t("account.unlimited")}`
                              : `${sub.audio_used} / ${limits.audio}`}
                          </span>
                        </div>
                        {!aUnlimited && <ProgressBar used={sub.audio_used} limit={limits.audio} />}
                      </div>
                    </div>
                    {/* Reset date */}
                    {sub.period_end && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={13} />
                        {t("account.resetDate")}: {formatDate(sub.period_end)}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Gestionar suscripción */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-italianto-800 text-white font-semibold rounded-xl hover:bg-italianto-900 disabled:opacity-60 transition-colors"
                >
                  {portalLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  {portalLoading ? t("account.manageLoading") : t("account.manage")}
                </button>
                {portalError && (
                  <p className="text-xs text-red-500 mt-2 text-center">{portalError}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 text-center leading-relaxed">
                  {t("account.cancelNote")}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
