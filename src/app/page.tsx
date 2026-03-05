"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import {
  Globe, FileText, Sparkles, Users, Download,
  Check, ArrowRight, BookOpen, Volume2
} from "lucide-react";

const exampleDialogue = `Marco. Buongiorno! Come stai?
Sofia. Bene, grazie! E tu, Marco?
Marco. Molto bene. Hai già fatto colazione?
Sofia. Sì, ho preso un caffè e un cornetto.
Marco. Ottima scelta! Andiamo al lavoro?
Sofia. Certo, andiamo!`;

const FEATURE_ICONS = [Globe, Users, FileText, Volume2, BookOpen, Download];
const FEATURE_KEYS = ["translation", "characters", "written", "audio", "education", "download"];
const PLANS = [
  { key: "basic", popular: false },
  { key: "standard", popular: true },
  { key: "pro", popular: false },
];

export default function LandingPage() {
  const { t, tArray } = useLanguage();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const steps = [
    { n: "01", title: t("landing.howItWorks.step1.title"), desc: t("landing.howItWorks.step1.desc") },
    { n: "02", title: t("landing.howItWorks.step2.title"), desc: t("landing.howItWorks.step2.desc") },
    { n: "03", title: t("landing.howItWorks.step3.title"), desc: t("landing.howItWorks.step3.desc") },
    { n: "04", title: t("landing.howItWorks.step4.title"), desc: t("landing.howItWorks.step4.desc") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/coliseo.jpg"
              alt="Coliseo Romano"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-italianto-900/85 via-italianto-900/70 to-black/60" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-1.5" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles size={14} className="text-italianto-300" />
                {t("landing.badge")}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                {t("landing.hero.title1")}{" "}
                <span className="text-italianto-300">{t("landing.hero.titleHighlight")}</span>{" "}
                {t("landing.hero.title2")}
              </h1>

              <p className="text-lg sm:text-xl text-italianto-100 leading-relaxed mb-8 max-w-2xl">
                {t("landing.hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-italianto-900 font-semibold rounded-xl hover:bg-italianto-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Sparkles size={18} />
                  {t("landing.hero.cta")}
                </Link>
                <Link
                  href="/#features"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  {t("landing.hero.ctaSecondary")}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EJEMPLO DE DIÁLOGO */}
        <section className="bg-italianto-50 dark:bg-slate-800 py-12 border-y border-italianto-100 dark:border-slate-700">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-italianto-600 uppercase tracking-wider mb-4">
              {t("landing.example.label")}
            </p>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-italianto border border-italianto-100 dark:border-slate-700 p-6 text-left">
              <pre className="text-gray-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {exampleDialogue}
              </pre>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {t("landing.example.caption")}
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("landing.features.title1")}{" "}
                <span className="text-italianto-700 dark:text-italianto-400">{t("landing.features.titleHighlight")}</span>
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                {t("landing.features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURE_KEYS.map((key, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <div
                    key={key}
                    className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 dark:bg-slate-800 hover:border-italianto-200 hover:shadow-italianto transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-italianto-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-italianto-100 transition-colors">
                      <Icon className="w-6 h-6 text-italianto-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{t(`landing.features.${key}.title`)}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{t(`landing.features.${key}.desc`)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-20 bg-italianto-50 dark:bg-slate-800">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("landing.howItWorks.title")}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-lg">{t("landing.howItWorks.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="relative">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-italianto-100 dark:border-slate-700 shadow-sm h-full">
                    <div className="text-4xl font-black text-italianto-100 mb-3">{n}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING — 3 PLANES */}
        <section id="pricing" className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("landing.pricing.title")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">{t("landing.pricing.subtitle")}</p>

            {/* Toggle mensual / anual */}
            <div className="inline-flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl p-1 mb-10">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  billing === "monthly"
                    ? "bg-white dark:bg-slate-900 shadow text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                }`}
              >
                {t("plans.toggleMonthly")}
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  billing === "annual"
                    ? "bg-white dark:bg-slate-900 shadow text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                }`}
              >
                {t("plans.toggleAnnual")}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {t("plans.savingsBadge")}
                </span>
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map(({ key, popular }) => (
                <div
                  key={key}
                  className={`relative rounded-2xl border p-6 text-left flex flex-col ${
                    popular
                      ? "border-italianto-500 shadow-italianto-lg ring-2 ring-italianto-300 dark:ring-italianto-700"
                      : "border-gray-200 dark:border-slate-700 shadow-sm dark:bg-slate-800"
                  }`}
                >
                  {popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-italianto-700 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                      {t("plans.popular")}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                    {t(`plans.${key}.name`)}
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
                    {t(`plans.${key}.description`)}
                  </p>
                  <div className="mb-1">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">
                      {billing === "monthly"
                        ? t(`plans.${key}.priceMonthly`)
                        : t(`plans.${key}.priceAnnual`)}
                    </span>
                    <span className="text-gray-500 dark:text-slate-400 text-sm ml-1">
                      {billing === "monthly" ? t("plans.perMonth") : t("plans.perYear")}
                    </span>
                  </div>
                  {billing === "annual" && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">{t("plans.annualNote")}</p>
                  )}
                  <ul className="space-y-2 my-4 flex-1">
                    {(tArray(`plans.${key}.features`) as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                        <Check className="w-4 h-4 text-italianto-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pricing"
                    className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors mt-2 ${
                      popular
                        ? "bg-italianto-800 text-white hover:bg-italianto-900"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {t("plans.cta")}
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-6">{t("plans.stripe")}</p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 bg-italianto-800 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              {t("landing.cta.title")}
            </h2>
            <p className="text-italianto-200 mb-8">
              {t("landing.cta.subtitle")}
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-italianto-900 font-bold rounded-xl hover:bg-italianto-50 transition-all duration-200 shadow-lg text-lg"
            >
              <Sparkles size={20} />
              {t("landing.cta.button")}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
