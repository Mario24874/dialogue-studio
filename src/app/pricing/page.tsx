import Link from "next/link";
import { Check } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Precios | Italianto Dialogue Studio",
};

const features = [
  "Diálogos en italiano ilimitados",
  "Traducción IA (español / inglés → italiano)",
  "Diálogos escritos con formato profesional",
  "Audio conversacional con voces ElevenLabs",
  "Hasta 6 personajes por diálogo",
  "Selección de voz por personaje",
  "Descarga de audios MP3",
  "Acceso web + APK Android",
  "Actualizaciones incluidas",
  "Soporte por email",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Precio simple y transparente</h1>
          <p className="text-gray-500 text-lg mb-12">Sin niveles confusos. Acceso completo por un precio fijo.</p>

          <div className="bg-italianto-800 text-white rounded-2xl overflow-hidden shadow-italianto-lg">
            <div className="h-1.5" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />
            <div className="p-8 md:p-10">
              <div className="mb-2 text-italianto-300 font-medium">Italianto Dialogue Studio</div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-6xl font-black">$4.99</span>
                <span className="text-italianto-300 text-xl">/ mes</span>
              </div>
              <p className="text-italianto-300 text-sm mb-8">Cancela cuando quieras. Sin permanencia.</p>

              <ul className="text-left space-y-3 mb-8">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-italianto-300/20 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-italianto-300" />
                    </div>
                    <span className="text-sm text-italianto-100">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="block w-full py-4 bg-white text-italianto-900 font-bold rounded-xl hover:bg-italianto-50 transition-colors text-lg"
              >
                Comenzar ahora
              </Link>
              <p className="text-xs text-italianto-400 mt-4">
                Pago seguro con Stripe · SSL encriptado · Cancela en cualquier momento
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            {[
              { q: "¿Hay período de prueba?", a: "No, pero puedes cancelar cuando quieras sin penalización." },
              { q: "¿Puedo cancelar?", a: "Sí, en cualquier momento desde tu perfil. Mantienes acceso hasta fin del período." },
              { q: "¿Cómo se factura?", a: "Mensualmente mediante Stripe. Aceptamos las principales tarjetas." },
            ].map(({ q, a }) => (
              <div key={q} className="p-4 bg-white rounded-xl border border-gray-100 text-left">
                <p className="font-semibold text-gray-900 mb-1">{q}</p>
                <p className="text-xs text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
