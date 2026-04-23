"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const STRINGS = {
  es: { title: "Algo salió mal", body: "Se produjo un error al cargar la aplicación. Intenta recargar la página.", retry: "Reintentar" },
  it: { title: "Qualcosa è andato storto", body: "Si è verificato un errore durante il caricamento. Prova a ricaricare la pagina.", retry: "Riprova" },
  en: { title: "Something went wrong", body: "An error occurred while loading the application. Try reloading the page.", retry: "Retry" },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [strings, setStrings] = useState(STRINGS.es);

  useEffect(() => {
    console.error("[Dialoghi Studio] Client error:", error);
    try {
      const lang = localStorage.getItem("italianto_lang") as keyof typeof STRINGS | null;
      if (lang && STRINGS[lang]) setStrings(STRINGS[lang]);
    } catch {}
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-6 text-center">
      <Image
        src="/studio/Logo_ItaliAnto.png"
        alt="Dialoghi Studio"
        width={72}
        height={72}
        className="rounded-2xl mb-6"
      />
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {strings.title}
      </h1>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-xs">
        {strings.body}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-italianto-800 text-white text-sm font-semibold rounded-xl hover:bg-italianto-900 transition-colors"
      >
        {strings.retry}
      </button>
    </div>
  );
}
