"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Wand2, Volume2, ChevronRight, X, Smartphone, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const SLIDE_COLORS = ["#2e7d32", "#1565c0", "#6a1b9a", "#004d40"] as const;
const SLIDES_COUNT = SLIDE_COLORS.length;

function detectPlatform(): "android" | "ios" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return null;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function Onboarding() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem("onboarding_completed");
      if (done) return;

      const detected = detectPlatform();
      setPlatform(detected);

      // Capturar el prompt de instalación nativo (Android Chrome)
      const handler = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e as BeforeInstallPromptEvent);
      };
      window.addEventListener("beforeinstallprompt", handler);

      // Mostrar inmediatamente — el splash (z-[9999]) lo cubre mientras dura
      setVisible(true);

      return () => window.removeEventListener("beforeinstallprompt", handler);
    } catch {
      // localStorage no disponible — no mostrar onboarding
    }
  }, []);

  const complete = () => {
    try {
      localStorage.setItem("onboarding_completed", "true");
    } catch {}
    setVisible(false);
  };

  const handleNext = () => {
    if (current < SLIDES_COUNT - 1) {
      setCurrent((c) => c + 1);
    } else {
      complete();
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    setInstalling(true);
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") complete();
    } finally {
      setInstalling(false);
    }
  };

  if (!visible) return null;

  const isLastSlide = current === SLIDES_COUNT - 1;
  const showInstallCard = isLastSlide && !isStandalone() && platform !== null;
  const currentColor = SLIDE_COLORS[current];

  const slideIcons = [
    <Image key="logo" src="/studio/Logo_ItaliAnto.png" alt="Italianto" width={96} height={96} className="rounded-2xl" priority />,
    <PenLine key="pen" size={80} className="text-white" />,
    <Wand2 key="wand" size={80} className="text-white" />,
    <Volume2 key="vol" size={80} className="text-white" />,
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col overflow-hidden select-none"
      animate={{ backgroundColor: currentColor }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Anillos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full border border-white/10"
          style={{ width: 500, height: 500, top: -120, right: -150 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full border border-white/[0.07]"
          style={{ width: 360, height: 360, bottom: -60, left: -100 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* Top bar: dots de progreso + botón omitir */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-4">
        <div className="flex gap-1.5 flex-1">
          {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full bg-white"
              animate={{ opacity: i <= current ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1 }}
            />
          ))}
        </div>
        <button
          onClick={complete}
          className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium transition-colors shrink-0"
        >
          <X size={14} />
          {t("onboarding.skip")}
        </button>
      </div>

      {/* Contenido del slide */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            {/* Ícono / Logo */}
            <motion.div
              className="mb-8 p-8 rounded-full bg-white/20"
              initial={{ scale: 0.75 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, delay: 0.05, type: "spring", stiffness: 220, damping: 18 }}
            >
              {slideIcons[current]}
            </motion.div>

            {/* Textos */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {t(`onboarding.slide${current + 1}.title`)}
            </h2>
            <p className="text-white/85 text-base leading-relaxed">
              {t(`onboarding.slide${current + 1}.desc`)}
            </p>

            {/* Tarjeta de instalación (último slide, solo móvil) */}
            {showInstallCard && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="mt-7 w-full bg-white/15 border border-white/25 rounded-2xl p-5 text-left"
              >
                <p className="text-white font-semibold text-sm mb-0.5">
                  {t("onboarding.install.title")}
                </p>
                <p className="text-white/65 text-xs mb-4">
                  {t("onboarding.install.subtitle")}
                </p>

                {/* Android con prompt nativo disponible */}
                {platform === "android" && installPrompt && (
                  <button
                    onClick={handleInstall}
                    disabled={installing}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white font-bold rounded-xl transition-opacity disabled:opacity-60 text-sm"
                    style={{ color: currentColor }}
                  >
                    <Smartphone size={16} />
                    {installing ? t("onboarding.install.installing") : t("onboarding.install.button")}
                  </button>
                )}

                {/* Android sin prompt (aún no disponible) */}
                {platform === "android" && !installPrompt && (
                  <p className="text-white/65 text-xs text-center">
                    {t("onboarding.install.androidHint")}
                  </p>
                )}

                {/* iOS: instrucciones manuales */}
                {platform === "ios" && (
                  <div className="flex items-start gap-2 text-white/85 text-sm bg-white/10 rounded-xl px-4 py-3">
                    <Plus size={15} className="mt-0.5 shrink-0" />
                    <span>{t("onboarding.install.iosHint")}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación inferior */}
      <div className="relative z-10 px-6 pb-12 pt-2">
        {/* Puntos indicadores */}
        <div className="flex justify-center gap-2 mb-7">
          {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === current ? 28 : 10, opacity: i === current ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              className="h-2.5 rounded-full bg-white"
            />
          ))}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-4 border-2 border-white/40 text-white font-semibold rounded-2xl hover:bg-white/10 active:bg-white/20 transition-colors text-sm"
            >
              ← {t("onboarding.back")}
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-4 bg-white font-bold rounded-2xl hover:opacity-90 active:opacity-75 transition-opacity text-sm flex items-center justify-center gap-1.5"
            style={{ color: currentColor }}
          >
            {isLastSlide ? (
              t("onboarding.start")
            ) : (
              <>
                {t("onboarding.next")}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
