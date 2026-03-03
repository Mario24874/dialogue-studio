"use client";
import Image from "next/image";
import Link from "next/link";
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

export default function LandingPage() {
  const { t, tArray } = useLanguage();

  const steps = [
    { n: "01", title: t("landing.howItWorks.step1.title"), desc: t("landing.howItWorks.step1.desc") },
    { n: "02", title: t("landing.howItWorks.step2.title"), desc: t("landing.howItWorks.step2.desc") },
    { n: "03", title: t("landing.howItWorks.step3.title"), desc: t("landing.howItWorks.step3.desc") },
    { n: "04", title: t("landing.howItWorks.step4.title"), desc: t("landing.howItWorks.step4.desc") },
  ];

  const pricingFeatures = tArray("landing.pricing.features");

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
                  href="/sign-up"
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
        <section className="bg-italianto-50 py-12 border-y border-italianto-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-italianto-600 uppercase tracking-wider mb-4">
              {t("landing.example.label")}
            </p>
            <div className="bg-white rounded-2xl shadow-italianto border border-italianto-100 p-6 text-left">
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
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("landing.features.title1")}{" "}
                <span className="text-italianto-700">{t("landing.features.titleHighlight")}</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {t("landing.features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURE_KEYS.map((key, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <div
                    key={key}
                    className="p-6 rounded-2xl border border-gray-100 hover:border-italianto-200 hover:shadow-italianto transition-all duration-300 group"
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
        <section className="py-20 bg-italianto-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("landing.howItWorks.title")}
              </h2>
              <p className="text-gray-600 text-lg">{t("landing.howItWorks.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-italianto-100 shadow-sm h-full">
                    <div className="text-4xl font-black text-italianto-100 mb-3">{n}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SIMPLE */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("landing.pricing.title")}
            </h2>
            <p className="text-gray-600 mb-10">{t("landing.pricing.subtitle")}</p>

            <div className="bg-italianto-800 text-white rounded-2xl overflow-hidden shadow-italianto-lg">
              <div className="h-1.5" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />
              <div className="p-8">
                <div className="text-5xl font-black mb-1">$4.99</div>
                <div className="text-italianto-300 mb-6">{t("landing.pricing.period")}</div>
                <ul className="text-left space-y-3 mb-8">
                  {pricingFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-italianto-300 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="block w-full py-3.5 bg-white text-italianto-900 font-bold rounded-xl hover:bg-italianto-50 transition-colors"
                >
                  {t("landing.pricing.cta")}
                </Link>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">{t("landing.pricing.stripe")}</p>
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
              href="/sign-up"
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
