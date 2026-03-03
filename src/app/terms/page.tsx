import LegalLayout from "@/components/layout/legal-layout";

export const metadata = {
  title: "Términos y Condiciones | Italianto Dialogue Studio",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Términos y Condiciones"
      subtitle="Italianto Dialogue Studio"
      lastUpdated="1 de marzo de 2026"
    >
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceptación de los términos</h2>
        <p>Al acceder y usar Italianto Dialogue Studio ("el Servicio"), aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte, no puedes usar el Servicio.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descripción del Servicio</h2>
        <p>Italianto Dialogue Studio es una aplicación web y móvil que permite a los usuarios generar diálogos en italiano mediante inteligencia artificial a partir de textos en español o inglés. El Servicio incluye:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Traducción automática al italiano mediante IA.</li>
          <li>Generación de diálogos escritos formateados.</li>
          <li>Generación de audio conversacional con voces de IA.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Suscripción y pagos</h2>
        <p>El acceso al Servicio requiere una suscripción mensual de <strong>$4.99 USD/mes</strong>. Al suscribirte:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Autorizas a Stripe a cobrar tu método de pago recurrentemente.</li>
          <li>La suscripción se renueva automáticamente cada mes.</li>
          <li>Puedes cancelar en cualquier momento desde tu cuenta. El acceso continúa hasta el fin del período pagado.</li>
          <li>No ofrecemos reembolsos por períodos parciales, salvo donde la ley lo requiera.</li>
          <li>Nos reservamos el derecho de cambiar precios con 30 días de aviso previo.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Uso aceptable</h2>
        <p>Al usar el Servicio, te comprometes a NO:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Generar contenido ilegal, ofensivo, discriminatorio o que viole derechos de terceros.</li>
          <li>Usar el Servicio para actividades fraudulentas o spam.</li>
          <li>Intentar acceder sin autorización a sistemas o datos del Servicio.</li>
          <li>Reproducir, distribuir o vender el Servicio sin autorización.</li>
          <li>Usar bots o scraping automatizado.</li>
          <li>Violar leyes aplicables en tu jurisdicción.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Propiedad intelectual</h2>
        <p>El Servicio, incluyendo su código, diseño, marca y contenido propio, es propiedad de Italianto. Los diálogos generados por ti usando el Servicio te pertenecen, sujeto a las limitaciones de las APIs de terceros utilizadas.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
        <p>El Servicio se proporciona "tal cual". No garantizamos que:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Las traducciones sean perfectas o libres de errores.</li>
          <li>El Servicio esté disponible de forma ininterrumpida.</li>
          <li>Los resultados sean adecuados para todos los propósitos.</li>
        </ul>
        <p className="mt-2">En la máxima medida permitida por la ley, nuestra responsabilidad total no superará el monto pagado en los últimos 3 meses.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cancelación de cuenta</h2>
        <p>Puedes cancelar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o terminar cuentas que violen estos Términos, sin reembolso.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cambios al servicio</h2>
        <p>Podemos modificar, suspender o discontinuar el Servicio con aviso razonable. No seremos responsables por modificaciones, suspensión o discontinuación del Servicio.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">9. Ley aplicable</h2>
        <p>Estos Términos se rigen por las leyes aplicables en la jurisdicción de operación de Italianto. Las disputas se resolverán mediante arbitraje o en los tribunales competentes.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contacto</h2>
        <p>Para preguntas sobre estos Términos:<br />
        <strong>Email:</strong> legal@italianto.com<br />
        <strong>Empresa:</strong> Italianto
        </p>
      </section>
    </LegalLayout>
  );
}
