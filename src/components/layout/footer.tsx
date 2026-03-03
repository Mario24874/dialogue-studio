"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-italianto-900 text-white">
      {/* Banner bandera italiana */}
      <div className="h-1 w-full" style={{background: "linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)"}} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={32} height={32} className="rounded-lg opacity-90" />
              <span className="font-bold text-lg">Italianto</span>
            </div>
            <p className="text-italianto-200 text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 text-italianto-100">{t("footer.product")}</h3>
            <ul className="space-y-2 text-sm text-italianto-300">
              <li><Link href="/#features" className="hover:text-white transition-colors">{t("footer.features")}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link></li>
              <li><Link href="/studio" className="hover:text-white transition-colors">{t("footer.studio")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 text-italianto-100">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm text-italianto-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">{t("footer.cookies")}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t("footer.about")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-italianto-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-italianto-400">
          <p>{t("footer.copyright", { year: String(year) })}</p>
          <p>{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
