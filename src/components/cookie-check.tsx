"use client"

import { useEffect, useState } from "react"

const MESSAGES = {
  es: {
    title: "Cookies desactivadas.",
    body: "Dialoghi Studio necesita cookies para iniciar sesión. Actívalas en",
    path: "Configuración → Privacidad → Cookies",
    reload: "y recarga.",
  },
  it: {
    title: "Cookie disabilitati.",
    body: "Dialoghi Studio ha bisogno dei cookie per accedere. Abilitali in",
    path: "Impostazioni → Privacy → Cookie",
    reload: "e ricarica.",
  },
  en: {
    title: "Cookies disabled.",
    body: "Dialoghi Studio needs cookies to sign in. Enable them in",
    path: "Settings → Privacy → Cookies",
    reload: "and reload.",
  },
}

function getLang(): keyof typeof MESSAGES {
  if (typeof navigator === "undefined") return "es"
  const code = navigator.language.slice(0, 2).toLowerCase()
  if (code === "it") return "it"
  if (code === "en") return "en"
  return "es"
}

/**
 * Detects cookies disabled in mobile browsers.
 * Clerk requires cookies — without them auth never completes.
 */
export function CookieCheck() {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    try {
      document.cookie = "__ctest=1; SameSite=Lax; Secure; path=/"
      const ok = document.cookie.includes("__ctest")
      document.cookie = "__ctest=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
      if (!ok) setBlocked(true)
    } catch {
      setBlocked(true)
    }
  }, [])

  if (!blocked) return null

  const m = MESSAGES[getLang()]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-red-900 border-t border-red-700 px-4 py-3 text-sm text-red-100">
      <strong>{m.title}</strong> {m.body}{" "}
      <strong>{m.path}</strong> {m.reload}
    </div>
  )
}
