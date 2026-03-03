"use client";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage, type Lang } from "@/contexts/language-context";

const FLAGS: Record<Lang, string> = { es: "🇪🇸", it: "🇮🇹", en: "🇺🇸" };

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  const langs: Lang[] = ["es", "it", "en"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-italianto-800 hover:bg-italianto-50 transition-all"
        aria-label="Cambiar idioma"
        title={t("lang." + lang)}
      >
        <Globe size={15} />
        <span className="hidden sm:inline">{FLAGS[lang]} {t("lang." + lang)}</span>
        <span className="sm:hidden">{FLAGS[lang]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                lang === l
                  ? "bg-italianto-50 text-italianto-800 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{FLAGS[l]}</span>
              <span>{t("lang." + l)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
