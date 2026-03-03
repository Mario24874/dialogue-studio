"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// URL del APK — actualizar con la URL real cuando esté publicado
// Puede ser un GitHub Release o cualquier CDN
const APK_URL = process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL || "#";

type Platform = "android" | "ios" | null;

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

  useEffect(() => {
    // No mostrar si ya está instalada como app (standalone/APK)
    if (isStandaloneMode()) return;

    const detected = detectPlatform();
    if (!detected) return;

    // No mostrar si el usuario la cerró antes (sesión actual)
    const dismissed = sessionStorage.getItem("app_banner_dismissed");
    if (dismissed) return;

    setPlatform(detected);
    // Pequeño delay para evitar flash en carga
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("app_banner_dismissed", "1");
  };

  if (!visible || !platform) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-slide-up">
      <div className="max-w-md mx-auto bg-white border border-italianto-100 rounded-2xl shadow-italianto-lg overflow-hidden">
        {/* Franja bandera italiana */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)" }} />

        <div className="flex items-center gap-3 p-4">
          {/* Logo */}
          <Image
            src="/Logo_ItaliAnto.png"
            alt="Italianto"
            width={44}
            height={44}
            className="rounded-xl flex-shrink-0"
          />

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">
              {platform === "android" ? t("mobile.androidTitle") : t("mobile.iosTitle")}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {platform === "android" ? t("mobile.androidSubtitle") : t("mobile.iosSubtitle")}
            </p>
          </div>

          {/* Acción */}
          {platform === "android" ? (
            <a
              href={APK_URL}
              onClick={dismiss}
              className="flex items-center gap-1.5 px-3 py-2 bg-italianto-800 text-white text-xs font-semibold rounded-lg hover:bg-italianto-900 transition-colors flex-shrink-0"
              download
            >
              <Download size={13} />
              {t("mobile.downloadApk")}
            </a>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-italianto-50 text-italianto-800 text-xs font-semibold rounded-lg flex-shrink-0 border border-italianto-200">
              <Plus size={13} />
              Share
            </div>
          )}

          {/* Cerrar */}
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
