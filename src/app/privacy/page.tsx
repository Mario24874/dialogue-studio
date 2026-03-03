import LegalLayout from "@/components/layout/legal-layout";

export const metadata = {
  title: "Política de Privacidad | Italianto Dialogue Studio",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Italianto Dialogue Studio"
      lastUpdated="1 de marzo de 2026"
    >
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Información que recopilamos</h2>
        <p>Al usar Italianto Dialogue Studio (&ldquo;el Servicio&rdquo;), recopilamos los siguientes tipos de información:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li><strong>Información de cuenta:</strong> nombre, dirección de correo electrónico y datos de autenticación proporcionados a través de Clerk.</li>
          <li><strong>Información de pago:</strong> procesada de forma segura por Stripe. No almacenamos datos de tarjetas de crédito.</li>
          <li><strong>Contenido generado:</strong> los textos de diálogos que ingresas para generar traducciones y audios.</li>
          <li><strong>Datos de uso:</strong> información sobre cómo interactúas con el Servicio (páginas visitadas, funciones utilizadas).</li>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, identificadores de dispositivo.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cómo usamos tu información</h2>
        <p>Usamos la información recopilada para:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Proporcionar, mantener y mejorar el Servicio.</li>
          <li>Procesar pagos y gestionar suscripciones.</li>
          <li>Enviar comunicaciones relacionadas con el servicio (confirmaciones, actualizaciones importantes).</li>
          <li>Generar traducciones y audios utilizando APIs de terceros (Anthropic Claude, ElevenLabs).</li>
          <li>Cumplir con obligaciones legales.</li>
          <li>Detectar y prevenir fraude o uso indebido.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Servicios de terceros</h2>
        <p>Utilizamos los siguientes proveedores de terceros, cada uno con su propia política de privacidad:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li><strong>Clerk</strong> (autenticación): clerk.com/privacy</li>
          <li><strong>Stripe</strong> (pagos): stripe.com/privacy</li>
          <li><strong>Anthropic</strong> (traducción IA): anthropic.com/privacy</li>
          <li><strong>ElevenLabs</strong> (generación de voz): elevenlabs.io/privacy</li>
          <li><strong>Supabase</strong> (base de datos): supabase.com/privacy</li>
          <li><strong>Netlify</strong> (hospedaje): netlify.com/privacy</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Compartir información</h2>
        <p>No vendemos tu información personal. Solo compartimos datos con:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Proveedores de servicios necesarios para operar el Servicio (mencionados arriba).</li>
          <li>Autoridades cuando sea requerido por ley.</li>
          <li>Terceros en caso de fusión, adquisición o venta de activos (con aviso previo).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Retención de datos</h2>
        <p>Conservamos tu información mientras mantengas una cuenta activa. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento contactándonos. Los datos de facturación se retienen según lo requerido por la ley aplicable.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Tus derechos</h2>
        <p>Dependiendo de tu ubicación, puedes tener derecho a:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li>Acceder a los datos personales que tenemos sobre ti.</li>
          <li>Corregir información inexacta.</li>
          <li>Solicitar la eliminación de tus datos (&ldquo;derecho al olvido&rdquo;).</li>
          <li>Portabilidad de datos.</li>
          <li>Oponerte al procesamiento de tus datos.</li>
        </ul>
        <p className="mt-2">Para ejercer estos derechos, contáctanos en: <strong>privacy@italianto.com</strong></p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Seguridad</h2>
        <p>Implementamos medidas técnicas y organizativas apropiadas para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por internet es 100% seguro.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Menores de edad</h2>
        <p>El Servicio no está dirigido a menores de 13 años (o 16 años en la UE). No recopilamos intencionalmente información de menores. Si eres padre/madre y crees que tu hijo ha proporcionado datos, contáctanos.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">9. Cambios a esta política</h2>
        <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso prominente en el Servicio.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contacto</h2>
        <p>Para preguntas sobre esta política, contáctanos en:<br />
        <strong>Email:</strong> privacy@italianto.com<br />
        <strong>Empresa:</strong> Italianto
        </p>
      </section>
    </LegalLayout>
  );
}
