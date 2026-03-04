// Server component layout — force-dynamic evita que Netlify CDN cachee el HTML
// estático de /studio y sirva chunks de builds anteriores.
export const dynamic = "force-dynamic";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
