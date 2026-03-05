"use client";
import LegalLayout from "@/components/layout/legal-layout";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t("about.title")} subtitle={t("about.subtitle")}>
      <div className="flex items-center gap-4 p-6 bg-italianto-50 rounded-2xl border border-italianto-100 mb-6 not-prose">
        <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={64} height={64} className="rounded-xl" />
        <div>
          <h2 className="text-xl font-bold text-italianto-900">Italianto</h2>
          <p className="text-italianto-700 text-sm">{t("about.tagline")}</p>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{t("about.missionTitle")}</h2>
        <p>{t("about.missionText")}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{t("about.productTitle")}</h2>
        <p>{t("about.productText1")}</p>
        <p className="mt-2">{t("about.productText2")}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{t("about.techTitle")}</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
          <li><strong>Traducción:</strong> {t("about.techTranslation")}</li>
          <li><strong>Audio:</strong> {t("about.techAudio")}</li>
          <li><strong>Plataforma:</strong> {t("about.techPlatform")}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{t("about.contactTitle")}</h2>
        <p>{t("about.contactText")}<br />
        <strong>Email:</strong> italiantonline@gmail.com
        </p>
      </section>
    </LegalLayout>
  );
}
