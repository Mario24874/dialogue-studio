"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

import es from "../../messages/es.json";
import it from "../../messages/it.json";
import en from "../../messages/en.json";

export type Lang = "es" | "it" | "en";

const MESSAGES: Record<Lang, typeof es> = { es, it, en };
const STORAGE_KEY = "italianto_lang";

// ─── Utilidad: acceso por dot-path ─────────────────────────────────────────
function getByPath(obj: Record<string, unknown>, path: string): string {
  const result = path.split(".").reduce<unknown>((cur, key) => {
    if (cur && typeof cur === "object") return (cur as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  return typeof result === "string" ? result : path;
}

// ─── Contexto ───────────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Traduce una clave dot-notation. Soporta {n}, {year}, {date} como interpolación. */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Devuelve un array de strings desde una clave (ej. para listas de features). */
  tArray: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  // Detectar idioma guardado o del navegador al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && ["es", "it", "en"].includes(saved)) {
      setLangState(saved);
      return;
    }
    const browser = navigator.language.slice(0, 2).toLowerCase();
    if (browser === "it") setLangState("it");
    else if (browser === "en") setLangState("en");
    // default: es
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const messages = MESSAGES[lang] as unknown as Record<string, unknown>;
      let str = getByPath(messages, key);
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [lang]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const messages = MESSAGES[lang] as unknown as Record<string, unknown>;
      const result = key.split(".").reduce<unknown>((cur, k) => {
        if (cur && typeof cur === "object") return (cur as Record<string, unknown>)[k];
        return undefined;
      }, messages);
      return Array.isArray(result) ? (result as string[]) : [];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
