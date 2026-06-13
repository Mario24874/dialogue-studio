export type Area = 'marketing' | 'app' | 'studio'
export interface SectionInfo { section: string; area: Area }
interface Rule { prefix: string; section: string; area: Area }

const RULES: Rule[] = [
  { prefix: '/studio', section: 'Studio', area: 'studio' },
  { prefix: '/pricing', section: 'Precios', area: 'studio' },
  { prefix: '/subscribe', section: 'Suscripción', area: 'studio' },
  { prefix: '/account', section: 'Cuenta', area: 'studio' },
  { prefix: '/about', section: 'Acerca', area: 'studio' },
  { prefix: '/terms', section: 'Términos', area: 'studio' },
  { prefix: '/privacy', section: 'Privacidad', area: 'studio' },
  { prefix: '/cookies', section: 'Cookies', area: 'studio' },
]

function matches(path: string, prefix: string): boolean {
  if (prefix === '/') return path === '/'
  return path === prefix || path.startsWith(prefix + '/')
}

export function resolveSection(path: string): SectionInfo {
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/'
  for (const r of RULES) if (matches(clean, r.prefix)) return { section: r.section, area: r.area }
  return { section: 'Otras', area: 'studio' }
}
