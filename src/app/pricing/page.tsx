"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";

type Billing = "monthly" | "annual";
type PlanId = "basic" | "standard" | "pro";

const PLANS: PlanId[] = ["basic", "standard", "pro"];

export default function PricingPage() {
  const { t, tArray } = useLanguage();
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("pricing.title")}</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg">{t("pricing.subtitle")}</p>
          </div>

          {/* Toggle mensual / anual */}
          <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-1 mb-10 max-w-xs mx-auto shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                billing === "monthly"
                  ? "bg-italianto-800 text-white shadow"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              }`}
            >
              {t("plans.toggleMonthly")}
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                billing === "annual"
                  ? "bg-italianto-800 text-white shadow"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
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

          {/* Cards de planes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-start">
            {PLANS.map((planId) => {
              const isPopular = planId === "standard";
              const features = tArray(`plans.${planId}.features`);
              const price = billing === "annual"
                ? t(`plans.${planId}.priceAnnual`)
                : t(`plans.${planId}.priceMonthly`);
              const period = billing === "annual" ? t("plans.perYear") : t("plans.perMonth");

              return (
                <div
                  key={planId}
                  className={`rounded-2xl overflow-hidden flex flex-col ${
                    isPopular
                      ? "bg-italianto-800 text-white shadow-2xl ring-2 ring-italianto-600"
                      : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md"
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
                    <ul className="space-y-2 mb-8 flex-1">
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
                    <Link
                      href={`/subscribe?billing=${billing}&planId=${planId}`}
                      className={`block w-full py-3 text-center font-bold rounded-xl transition-colors ${
                        isPopular
                          ? "bg-white text-italianto-900 hover:bg-italianto-50"
                          : "bg-italianto-800 text-white hover:bg-italianto-900"
                      }`}
                    >
                      {t("plans.cta")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">{t("pricing.faqTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-slate-400">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-left">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{t(`pricing.faq.${i}.q`)}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{t(`pricing.faq.${i}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
