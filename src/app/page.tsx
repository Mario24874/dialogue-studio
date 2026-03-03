import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Globe, FileText, Sparkles, Users, Download,
  Check, ArrowRight, BookOpen, Volume2
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Traducción Inteligente",
    desc: "Escribe tu diálogo en español o inglés y nuestra IA lo traduce a italiano natural y coloquial.",
  },
  {
    icon: Users,
    title: "Múltiples Personajes",
    desc: "Agrega todos los participantes del diálogo. Asigna nombre, género y voz a cada uno.",
  },
  {
    icon: FileText,
    title: "Diálogo Escrito",
    desc: 'Resultado formateado profesionalmente: "Marco. Ciao! Sofia. Come stai?"',
  },
  {
    icon: Volume2,
    title: "Audio Conversacional",
    desc: "Genera un audio natural donde cada personaje habla con su propia voz de ElevenLabs.",
  },
  {
    icon: BookOpen,
    title: "Para Estudiantes y Docentes",
    desc: "Ideal para crear material de práctica auditiva y escrita en clases de italiano.",
  },
  {
    icon: Download,
    title: "Descarga el Audio",
    desc: "Descarga el diálogo en MP3 para usar offline en cualquier dispositivo.",
  },
];

const steps = [
  { n: "01", title: "Escribe el diálogo", desc: "Ingresa la conversación en español o inglés. Puede ser de 2 o más personas." },
  { n: "02", title: "Configura los personajes", desc: "Asigna nombre, género y voz ElevenLabs a cada participante." },
  { n: "03", title: "Elige el formato", desc: "Selecciona si quieres el resultado escrito o como audio conversacional." },
  { n: "04", title: "¡Genera el diálogo!", desc: "La IA traduce al italiano y genera el diálogo listo para usar." },
];

const exampleDialogue = `Marco. Buongiorno! Come stai?
Sofia. Bene, grazie! E tu, Marco?
Marco. Molto bene. Hai già fatto colazione?
Sofia. Sì, ho preso un caffè e un cornetto.
Marco. Ottima scelta! Andiamo al lavoro?
Sofia. Certo, andiamo!`;

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative text-white overflow-hidden">
          {/* Imagen de fondo: Coliseo */}
          <div className="absolute inset-0">
            <Image
              src="/coliseo.jpg"
              alt="Coliseo Romano"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Overlay oscuro para legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-br from-italianto-900/85 via-italianto-900/70 to-black/60" />
          </div>

          {/* Franja de la bandera italiana */}
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles size={14} className="text-italianto-300" />
                Powered by Claude AI + ElevenLabs
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Genera diálogos{" "}
                <span className="text-italianto-300">en italiano</span>{" "}
                con IA
              </h1>

              <p className="text-lg sm:text-xl text-italianto-100 leading-relaxed mb-8 max-w-2xl">
                Convierte cualquier conversación del español o inglés al italiano. 
                Obtén el resultado escrito o como audio natural con voces reales.
                Perfecto para aprender y enseñar italiano.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-italianto-900 font-semibold rounded-xl hover:bg-italianto-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Sparkles size={18} />
                  Comenzar ahora — $4.99/mes
                </Link>
                <Link
                  href="/#features"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  Ver cómo funciona
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EJEMPLO DE DIÁLOGO */}
        <section className="bg-italianto-50 py-12 border-y border-italianto-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-italianto-600 uppercase tracking-wider mb-4">
              Ejemplo de diálogo generado
            </p>
            <div className="bg-white rounded-2xl shadow-italianto border border-italianto-100 p-6 text-left">
              <pre className="text-gray-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {exampleDialogue}
              </pre>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Generado automáticamente desde una conversación en español
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas para{" "}
                <span className="text-italianto-700">crear diálogos en italiano</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Una herramienta completa para estudiantes, docentes y amantes del italiano.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl border border-gray-100 hover:border-italianto-200 hover:shadow-italianto transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-italianto-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-italianto-100 transition-colors">
                    <Icon className="w-6 h-6 text-italianto-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-20 bg-italianto-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-gray-600 text-lg">En 4 simples pasos</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-italianto-100 shadow-sm h-full">
                    <div className="text-4xl font-black text-italianto-100 mb-3">{n}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SIMPLE */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un precio simple
            </h2>
            <p className="text-gray-600 mb-10">Sin límites. Sin sorpresas.</p>

            <div className="bg-italianto-800 text-white rounded-2xl overflow-hidden shadow-italianto-lg">
              <div className="h-1.5" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />
              <div className="p-8">
                <div className="text-5xl font-black mb-1">$4.99</div>
                <div className="text-italianto-300 mb-6">por mes · cancela cuando quieras</div>
                <ul className="text-left space-y-3 mb-8">
                  {[
                    "Diálogos ilimitados",
                    "Traducción al italiano con IA",
                    "Audio con voces ElevenLabs",
                    "Diálogos escritos formateados",
                    "Múltiples personajes",
                    "Descarga de audios MP3",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-italianto-300 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="block w-full py-3.5 bg-white text-italianto-900 font-bold rounded-xl hover:bg-italianto-50 transition-colors"
                >
                  Empezar ahora
                </Link>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Pago seguro con Stripe • Cancela en cualquier momento
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 bg-italianto-800 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para aprender italiano?
            </h2>
            <p className="text-italianto-200 mb-8">
              Únete a Italianto Dialogue Studio y genera tus primeros diálogos hoy.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-italianto-900 font-bold rounded-xl hover:bg-italianto-50 transition-all duration-200 shadow-lg text-lg"
            >
              <Sparkles size={20} />
              Comenzar — $4.99/mes
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
