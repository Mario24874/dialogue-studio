"use client";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";

type Plan = "monthly" | "annual";

export default function PricingPage() {
  const { t, tArray } = useLanguage();
  const [plan, setPlan] = useState<Plan>("annual");
  const features = tArray("pricing.features");
  const faq = [0, 1, 2].map((i) => ({
    q: t(`pricing.faq.${i}.q`),
    a: t(`pricing.faq.${i}.a`),
  }));

  const isAnnual = plan === "annual";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("pricing.title")}</h1>
          <p className="text-gray-500 text-lg mb-8">{t("pricing.subtitle")}</p>

          {/* Selector mensual / anual */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-10 max-w-xs mx-auto shadow-sm">
            <button
              onClick={() => setPlan("monthly")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                !isAnnual
                  ? "bg-italianto-800 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("pricing.planMonthly")}
            </button>
            <button
              onClick={() => setPlan("annual")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isAnnual
                  ? "bg-italianto-800 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("pricing.planAnnual")}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isAnnual ? "bg-white/20 text-white" : "bg-italianto-100 text-italianto-800"
              }`}>
                {t("pricing.savingsBadge")}
              </span>
            </button>
          </div>

          <div className="bg-italianto-800 text-white rounded-2xl overflow-hidden shadow-italianto-lg">
            <div className="h-1.5" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />
            <div className="p-8 md:p-10">
              <div className="mb-2 text-italianto-300 font-medium">Italianto Dialogue Studio</div>

              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-6xl font-black">
                  {isAnnual ? t("pricing.priceAnnual") : t("pricing.priceMonthly")}
                </span>
                <span className="text-italianto-300 text-xl">
                  {isAnnual ? t("pricing.periodAnnual") : t("pricing.periodMonthly")}
                </span>
              </div>

              {isAnnual && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-italianto-300 mb-2">
                  <Zap size={11} />
                  <span>vs $4.99/mes — un solo pago al año</span>
                </div>
              )}

              <p className="text-italianto-300 text-sm mb-8">{t("pricing.cancel")}</p>

              <ul className="text-left space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-italianto-300/20 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-italianto-300" />
                    </div>
                    <span className="text-sm text-italianto-100">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/sign-up?plan=${plan}`}
                className="block w-full py-4 bg-white text-italianto-900 font-bold rounded-xl hover:bg-italianto-50 transition-colors text-lg"
              >
                {t("pricing.cta")}
              </Link>
              <p className="text-xs text-italianto-400 mt-4">{t("pricing.stripe")}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            {faq.map(({ q, a }) => (
              <div key={q} className="p-4 bg-white rounded-xl border border-gray-100 text-left">
                <p className="font-semibold text-gray-900 mb-1">{q}</p>
                <p className="text-xs text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
