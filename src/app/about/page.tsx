import LegalLayout from "@/components/layout/legal-layout";
import Image from "next/image";

export const metadata = {
  title: "Sobre Nosotros | Italianto Dialogue Studio",
};

export default function AboutPage() {
  return (
    <LegalLayout title="Sobre Nosotros" subtitle="Italianto — Aprende italiano de forma natural">
      <div className="flex items-center gap-4 p-6 bg-italianto-50 rounded-2xl border border-italianto-100 mb-6 not-prose">
        <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={64} height={64} className="rounded-xl" />
        <div>
          <h2 className="text-xl font-bold text-italianto-900">Italianto</h2>
          <p className="text-italianto-700 text-sm">Tu plataforma para aprender italiano con IA</p>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Nuestra misión</h2>
        <p>En Italianto creemos que aprender italiano debe ser una experiencia auténtica, inmersiva y accesible. Nuestra misión es crear herramientas que conecten a los estudiantes con el italiano real, tal como se habla en la vida cotidiana.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Dialogue Studio</h2>
        <p>Italianto Dialogue Studio es nuestra herramienta para generar diálogos auténticos en italiano. Usando inteligencia artificial de última generación (Claude de Anthropic) y síntesis de voz natural (ElevenLabs), transformamos conversaciones simples en material de estudio de alta calidad.</p>
        <p className="mt-2">Ya sea que seas estudiante, docente, o simplemente un apasionado del italiano, Dialogue Studio te ayuda a crear material de práctica en segundos.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Tecnología</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li><strong>Traducción:</strong> Claude (Anthropic) — IA de comprensión del lenguaje natural.</li>
          <li><strong>Audio:</strong> ElevenLabs — síntesis de voz multilingüe ultra-realista.</li>
          <li><strong>Plataforma:</strong> Next.js, disponible como web app y APK para Android.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Contacto</h2>
        <p>¿Tienes preguntas o sugerencias?<br />
        <strong>Email:</strong> hello@italianto.com
        </p>
      </section>
    </LegalLayout>
  );
}
