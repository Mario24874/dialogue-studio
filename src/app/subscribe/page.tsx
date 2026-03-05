"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type Billing = "monthly" | "annual";
type PlanId = "basic" | "standard" | "pro";

const PLANS: PlanId[] = ["basic", "standard", "pro"];

function SubscribeContent() {
  const { t, tArray } = useLanguage();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<Billing>("annual");
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const b = searchParams.get("billing");
    if (b === "monthly" || b === "annual") setBilling(b);
  }, [searchParams]);

  const handleSubscribe = async (planId: PlanId) => {
    setLoadingPlan(planId);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billing }),
      });
      if (res.status === 401) {
        window.location.href = "/sign-in?redirect_url=/subscribe";
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || t("plans.errorPayment"));
        setLoadingPlan(null);
      }
    } catch {
      setError(t("plans.errorConnection"));
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-italianto-50 via-white to-italianto-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={52} height={52} className="rounded-xl shadow-italianto" />
            <span className="text-3xl font-bold text-italianto-800">Italianto</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dialogue Studio</h1>
          <p className="text-gray-600">{t("subscribe.title")}</p>
        </div>

        {/* Toggle mensual / anual */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-8 max-w-xs mx-auto shadow-sm">
          <button
            onClick={() => setBilling("monthly")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              billing === "monthly"
                ? "bg-italianto-800 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("plans.toggleMonthly")}
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              billing === "annual"
                ? "bg-italianto-800 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("plans.toggleAnnual")}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              billing === "annual" ? "bg-white/20 text-white" : "bg-italianto-100 text-italianto-800"
            }`}>
              {t("plans.savingsBadge")}
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Cards de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
          {PLANS.map((planId) => {
            const isPopular = planId === "standard";
            const features = tArray(`plans.${planId}.features`);
            const price = billing === "annual"
              ? t(`plans.${planId}.priceAnnual`)
              : t(`plans.${planId}.priceMonthly`);
            const period = billing === "annual" ? t("plans.perYear") : t("plans.perMonth");
            const isLoading = loadingPlan === planId;
            const anyLoading = loadingPlan !== null;

            return (
              <div
                key={planId}
                className={`rounded-2xl overflow-hidden flex flex-col ${
                  isPopular
                    ? "bg-italianto-800 text-white shadow-2xl ring-2 ring-italianto-600"
                    : "bg-white border border-gray-200 shadow-md"
                }`}
              >
                <div className="h-1.5" style={{ background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)" }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-4">
                    {isPopular && (
                      <span className="inline-block text-xs font-bold px-2 py-1 bg-white/20 text-white rounded-full mb-2">
                        {t("plans.popular")}
                      </span>
                    )}
                    <h3 className={`text-xl font-bold ${isPopular ? "text-white" : "text-gray-900"}`}>
                      {t(`plans.${planId}.name`)}
                    </h3>
                    <p className={`text-sm ${isPopular ? "text-italianto-200" : "text-gray-500"}`}>
                      {t(`plans.${planId}.description`)}
                    </p>
                  </div>

                  {/* Precio */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${isPopular ? "text-white" : "text-gray-900"}`}>
                        {price}
                      </span>
                      <span className={`text-sm ${isPopular ? "text-italianto-300" : "text-gray-500"}`}>
                        {period}
                      </span>
                    </div>
                    {billing === "annual" && (
                      <p className={`text-xs mt-1 ${isPopular ? "text-italianto-300" : "text-gray-400"}`}>
                        {t("plans.annualNote")}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          isPopular ? "bg-white/20" : "bg-italianto-50"
                        }`}>
                          <Check size={10} className={isPopular ? "text-white" : "text-italianto-700"} />
                        </div>
                        <span className={`text-sm ${isPopular ? "text-italianto-100" : "text-gray-700"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleSubscribe(planId)}
                    disabled={anyLoading}
                    className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                      isPopular
                        ? "bg-white text-italianto-900 hover:bg-italianto-50"
                        : "bg-italianto-800 text-white hover:bg-italianto-900"
                    }`}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("plans.redirecting")}</>
                    ) : (
                      t("plans.subscribe")
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-gray-400 mb-2">{t("plans.stripe")}</p>
        <p className="text-center text-xs text-gray-400">
          {t("plans.legalPrefix")}{" "}
          <a href="/terms" className="underline hover:text-italianto-700">{t("plans.terms")}</a>
          {" "}{t("plans.and")}{" "}
          <a href="/privacy" className="underline hover:text-italianto-700">{t("plans.privacy")}</a>
        </p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeContent />
    </Suspense>
  );
}
