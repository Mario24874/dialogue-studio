"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Loader2, Sparkles, Mic, FileText, Globe } from "lucide-react";

const features = [
  { icon: Globe, text: "Traducción automática al italiano con IA" },
  { icon: FileText, text: "Diálogos escritos con formato profesional" },
  { icon: Mic, text: "Audio conversacional con voces naturales ElevenLabs" },
  { icon: Sparkles, text: "Acceso ilimitado a generación de diálogos" },
];

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al iniciar el pago");
        setLoading(false);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-italianto-50 via-white to-italianto-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={52} height={52} className="rounded-xl shadow-italianto" />
            <span className="text-3xl font-bold text-italianto-800">Italianto</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dialogue Studio</h1>
          <p className="text-gray-600">Activa tu suscripción para generar diálogos en italiano</p>
        </div>

        {/* Card de precio */}
        <div className="bg-white rounded-2xl shadow-italianto-lg border border-italianto-100 overflow-hidden">
          {/* Banner bandera italiana */}
          <div className="h-2 w-full" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-5xl font-bold text-italianto-800">$4.99</span>
                <span className="text-gray-500 text-lg">/mes</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Cancela cuando quieras</p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-italianto-50 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-italianto-700" />
                  </div>
                  <span className="text-gray-700 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-4 bg-italianto-800 hover:bg-italianto-900 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-italianto-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Redirigiendo a pago...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Suscribirme ahora</>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              Pago seguro con Stripe • SSL encriptado
            </p>
          </div>
        </div>

        {/* Links legales */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Al suscribirte aceptas nuestros{" "}
          <a href="/terms" className="underline hover:text-italianto-700">Términos de Uso</a>
          {" "}y{" "}
          <a href="/privacy" className="underline hover:text-italianto-700">Política de Privacidad</a>
        </p>
      </div>
    </div>
  );
}
