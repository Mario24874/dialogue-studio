"use client";
import { useState } from "react";
import Image from "next/image";
import { Check, Loader2, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type Plan = "monthly" | "annual";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<Plan>("annual");
  const { t, tArray } = useLanguage();
  const features = tArray("subscribe.features");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || t("subscribe.errorPayment"));
        setLoading(false);
      }
    } catch {
      setError(t("subscribe.errorConnection"));
      setLoading(false);
    }
  };

  const isAnnual = plan === "annual";

  return (
    <div className="min-h-screen bg-gradient-to-br from-italianto-50 via-white to-italianto-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={52} height={52} className="rounded-xl shadow-italianto" />
            <span className="text-3xl font-bold text-italianto-800">Italianto</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dialogue Studio</h1>
          <p className="text-gray-600">{t("subscribe.title")}</p>
        </div>

        {/* Selector de plan */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setPlan("monthly")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              !isAnnual
                ? "bg-white text-italianto-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("subscribe.planMonthly")}
          </button>
          <button
            onClick={() => setPlan("annual")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              isAnnual
                ? "bg-white text-italianto-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("subscribe.planAnnual")}
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-italianto-100 text-italianto-800 rounded-full">
              {t("subscribe.savingsBadge")}
            </span>
          </button>
        </div>

        {/* Card de precio */}
        <div className="bg-white rounded-2xl shadow-italianto-lg border border-italianto-100 overflow-hidden">
          <div className="h-2 w-full" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-5xl font-bold text-italianto-800">
                  {isAnnual ? t("subscribe.priceAnnual") : t("subscribe.priceMonthly")}
                </span>
                <span className="text-gray-500 text-lg">
                  {isAnnual ? t("subscribe.periodAnnual") : t("subscribe.periodMonthly")}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {isAnnual ? t("subscribe.cancelAnnual") : t("subscribe.cancelMonthly")}
              </p>
              {isAnnual && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-italianto-700 bg-italianto-50 border border-italianto-100 px-3 py-1 rounded-full font-medium">
                  <Zap size={11} />
                  vs $4.99/mes — pagas una sola vez al año
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-italianto-50 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-italianto-700" />
                  </div>
                  <span className="text-gray-700 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-4 bg-italianto-800 hover:bg-italianto-900 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-italianto-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t("subscribe.redirecting")}</>
              ) : (
                <><Sparkles className="w-5 h-5" /> {t("subscribe.cta")}</>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              {t("subscribe.stripe")}
            </p>
          </div>
        </div>

        {/* Links legales */}
        <p className="text-center text-xs text-gray-400 mt-6">
          {t("subscribe.legalPrefix")}{" "}
          <a href="/terms" className="underline hover:text-italianto-700">{t("subscribe.terms")}</a>
          {" "}{t("subscribe.and")}{" "}
          <a href="/privacy" className="underline hover:text-italianto-700">{t("subscribe.privacy")}</a>
        </p>
      </div>
    </div>
  );
}
