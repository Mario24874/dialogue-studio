import LegalLayout from "@/components/layout/legal-layout";

export const metadata = {
  title: "Política de Cookies | Italianto Dialogue Studio",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" subtitle="Italianto Dialogue Studio" lastUpdated="1 de marzo de 2026">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestra aplicación. Nos ayudan a recordar tus preferencias y mejorar tu experiencia.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que usamos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-italianto-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Tipo</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Propósito</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="px-4 py-2 font-medium">Esenciales</td><td className="px-4 py-2">Autenticación de sesión (Clerk). Necesarias para el funcionamiento.</td><td className="px-4 py-2">Sesión / 30 días</td></tr>
              <tr><td className="px-4 py-2 font-medium">Funcionales</td><td className="px-4 py-2">Recordar preferencias (idioma, tema).</td><td className="px-4 py-2">1 año</td></tr>
              <tr><td className="px-4 py-2 font-medium">Analíticas</td><td className="px-4 py-2">Medir uso del Servicio para mejorarlo.</td><td className="px-4 py-2">90 días</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Control de cookies</h2>
        <p>Puedes controlar las cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar las cookies esenciales puede impedir el correcto funcionamiento del Servicio.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Contacto</h2>
        <p>Para preguntas sobre cookies: <strong>privacy@italianto.com</strong></p>
      </section>
    </LegalLayout>
  );
}
