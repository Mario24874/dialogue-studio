"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Plus, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const APK_URL = process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL || "#";

type Platform = "android" | "ios" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return null;
}

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function MobileAppBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneMode()) return;
    const detected = detectPlatform();
    if (!detected) return;
    const dismissed = sessionStorage.getItem("app_banner_dismissed");
    if (dismissed) return;

    // Catch native PWA install prompt (Android Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    setPlatform(detected);
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("app_banner_dismissed", "1");
  };

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") dismiss();
    }
  };

  if (!visible || !platform) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-slide-up">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 border border-italianto-100 dark:border-slate-700 rounded-2xl shadow-italianto-lg overflow-hidden">
        <div className="h-1" style={{ background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)" }} />

        <div className="flex items-center gap-3 p-4">
          <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={44} height={44} className="rounded-xl flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
              {platform === "android" ? t("mobile.androidTitle") : t("mobile.iosTitle")}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
              {platform === "android" ? t("mobile.androidSubtitle") : t("mobile.iosSubtitle")}
            </p>
          </div>

          {/* Acción según plataforma */}
          {platform === "android" ? (
            installPrompt ? (
              // PWA install nativo (Chrome en Android)
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 bg-italianto-800 text-white text-xs font-semibold rounded-lg hover:bg-italianto-900 transition-colors flex-shrink-0"
              >
                <Smartphone size={13} />
                {t("mobile.installApp")}
              </button>
            ) : (
              // Fallback: descargar APK
              <a
                href={APK_URL}
                onClick={dismiss}
                className="flex items-center gap-1.5 px-3 py-2 bg-italianto-800 text-white text-xs font-semibold rounded-lg hover:bg-italianto-900 transition-colors flex-shrink-0"
                download
              >
                <Download size={13} />
                {t("mobile.downloadApk")}
              </a>
            )
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-italianto-50 dark:bg-slate-700 text-italianto-800 dark:text-italianto-300 text-xs font-semibold rounded-lg flex-shrink-0 border border-italianto-200 dark:border-slate-600">
              <Plus size={13} />
              {t("mobile.iosAction")}
            </div>
          )}

          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0 ml-1"
            aria-label="Cerrar"
          >
            {t("mobile.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
