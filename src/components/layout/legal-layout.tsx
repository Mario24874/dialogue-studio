import Header from "./header";
import Footer from "./footer";

interface Props {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, subtitle, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-2">Última actualización: {lastUpdated}</p>
          )}
        </div>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-6 leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
