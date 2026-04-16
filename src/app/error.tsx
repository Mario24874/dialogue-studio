"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dialoghi Studio] Client error:", error);
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
        Algo salió mal
      </h1>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-xs">
        Se produjo un error al cargar la aplicación. Intenta recargar la página.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-italianto-800 text-white text-sm font-semibold rounded-xl hover:bg-italianto-900 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
