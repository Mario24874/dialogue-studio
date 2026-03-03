# PROJECT_CONTEXT.md — Italianto Dialogue Studio

## 🚨 INSTRUCCIÓN PARA DESARROLLADORES
**Este archivo es la bitácora oficial del proyecto. Todo desarrollador o agente que trabaje aquí debe:**
1. Leer este documento completo antes de hacer cualquier cambio.
2. Actualizar este documento al finalizar su sesión de trabajo.
3. Registrar problemas encontrados y cómo se resolvieron.

---

## 📋 Descripción del Producto

**Italianto Dialogue Studio** es una aplicación web y móvil (APK Android) que permite generar diálogos en italiano a partir de conversaciones escritas en español o inglés. Es un producto de pago por suscripción de la marca **Italianto**.

### Propósito
El usuario ingresa un diálogo en español o inglés, configura los personajes (nombre, género, voz), elige si quiere el resultado como texto escrito o como audio conversacional, y la IA genera el diálogo completo en italiano natural.

### Resultado esperado
- **Escrito:** `Marco. Ciao Sofia! Come stai?` / `Sofia. Bene grazie! E tu Marco?`
- **Audio:** MP3 conversacional donde cada personaje habla con su propia voz (sin leer los nombres).

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología | Versión | Notas |
|------|-----------|---------|-------|
| Framework | Next.js | 15.4.7 | App Router |
| UI | React + TypeScript | 19.1.0 / 5.9.2 | |
| Estilos | Tailwind CSS v4 | 4.1.12 | Config vía `@theme` en CSS, NO tailwind.config.ts |
| PostCSS | @tailwindcss/postcss | 4.2.1 | **Requerido** para que Tailwind v4 funcione |
| Auth | Clerk (@clerk/nextjs) | 6.x | Condicional si no hay keys configuradas |
| Base de datos | Supabase | 2.x | PostgreSQL gestionado |
| Pagos | Stripe | 17.x | Suscripción $4.99/mes |
| Traducción IA | Anthropic Claude Haiku | claude-haiku-4-5-20251001 | Carga dinámica, solo en modo live |
| Audio TTS | ElevenLabs | eleven_multilingual_v2 | Voces por personaje |
| APK | Capacitor v7 | 7.2.0 | Wrapper nativo que carga URL de Netlify |
| Deploy | Netlify | — | @netlify/plugin-nextjs |
| Iconos | lucide-react | 0.474.0 | |
| Estado | zustand | 5.0.3 | Instalado, disponible para uso futuro |
| Forms | react-hook-form + zod | 7.x / 3.x | Instalado, disponible para uso futuro |

### Instalación de dependencias
```bash
# SIEMPRE usar legacy-peer-deps (React 19.1.0 vs peer dep de Clerk)
npm install --legacy-peer-deps
```

---

## 📁 Estructura Completa de Archivos

```
dialogue-studio/
│
├── public/
│   ├── Logo_ItaliAnto.png        # Logo oficial de la marca Italianto
│   └── coliseo.jpg               # Imagen de fondo del hero (Coliseo Romano)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout con ClerkProvider condicional
│   │   ├── globals.css           # Tailwind v4: @theme con colores + @utility
│   │   ├── page.tsx              # Landing page pública (hero, features, pricing, CTA)
│   │   │
│   │   ├── sign-in/[[...sign-in]]/page.tsx   # Login Clerk
│   │   ├── sign-up/[[...sign-up]]/page.tsx   # Registro Clerk
│   │   ├── subscribe/page.tsx    # Muro de pago Stripe (post-registro)
│   │   ├── pricing/page.tsx      # Página de precios pública
│   │   ├── about/page.tsx        # Sobre Italianto
│   │   ├── privacy/page.tsx      # Política de Privacidad (META, Amazon, tiendas)
│   │   ├── terms/page.tsx        # Términos y Condiciones
│   │   ├── cookies/page.tsx      # Política de Cookies (GDPR)
│   │   │
│   │   ├── studio/page.tsx       # App principal — flujo de 4 pasos (protegida)
│   │   │
│   │   └── api/
│   │       ├── translate/route.ts         # Traducción al italiano (Claude o mock)
│   │       ├── generate-audio/route.ts    # Generación de audio MP3 (ElevenLabs)
│   │       ├── subscription/route.ts      # Verificar suscripción activa
│   │       └── stripe/
│   │           ├── checkout/route.ts      # Crear Stripe Checkout Session
│   │           └── webhook/route.ts       # Procesar eventos Stripe
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx        # Header con logo grande + nav + Clerk UserButton
│   │   │   ├── footer.tsx        # Footer verde oscuro con links legales
│   │   │   └── legal-layout.tsx  # Layout reutilizable para páginas legales
│   │   └── studio/
│   │       └── character-builder.tsx  # Configurador de personajes (nombre/género/voz)
│   │
│   ├── lib/
│   │   ├── utils.ts              # cn() helper (clsx + tailwind-merge)
│   │   ├── supabase.ts           # supabase client + createServiceClient()
│   │   └── stripe.ts             # stripe client + constantes
│   │
│   └── middleware.ts             # Modo preview (pass-through) / producción (Clerk)
│
├── supabase/
│   └── schema.sql                # Schema SQL completo — ejecutar en Supabase
│
├── capacitor.config.ts           # Config APK: apunta a Netlify en prod, localhost en dev
├── netlify.toml                  # Config deploy Netlify con headers de seguridad
├── postcss.config.mjs            # PostCSS con @tailwindcss/postcss (OBLIGATORIO en v4)
├── tailwind.config.ts            # En v4 solo usado para darkMode y content paths
├── next.config.ts                # Headers seguridad + symlinks WSL2
├── env.example                   # Plantilla de variables de entorno (SIN valores reales)
├── .env.local                    # Variables reales (NO subir a Git, en .gitignore)
├── .npmrc                        # legacy-peer-deps=true
└── .gitignore                    # Excluye: .next, node_modules, .env*, ItaliantoApp/
```

---

## 🎨 Identidad Visual Italianto

La app sigue la identidad visual del ecosistema Italianto, coherente con la app móvil existente.

| Token | Valor | Clase Tailwind |
|-------|-------|----------------|
| Verde primario oscuro | `#2e7d32` | `italianto-800` |
| Verde primario | `#4caf50` | `italianto-500` |
| Verde primario claro | `#66bb6a` | `italianto-400` |
| Verde muy oscuro | `#1b5e20` | `italianto-900` |
| Fondo claro | `#f5f5f5` | — |
| Bandera italiana | `#009246` / `#ffffff` / `#ce2b37` | — |

### Elementos visuales clave
- **Hero**: Imagen `coliseo.jpg` con overlay `from-italianto-900/85` para legibilidad
- **Franja bandera**: `h-1.5` con gradiente verde/blanco/rojo arriba del hero y footer
- **Logo**: `Logo_ItaliAnto.png` — 52×52px en header, 48×48px en auth pages, 64×64px en About
- **Header**: altura 72px con logo grande y nav responsive

### Configuración Tailwind v4
> ⚠️ **Importante:** En Tailwind v4 los colores personalizados van en `globals.css` dentro de `@theme { }`, NO en `tailwind.config.ts`. Las utilidades personalizadas van en `@utility { }`.

```css
/* globals.css */
@theme {
  --color-italianto-800: #2e7d32;
  /* ... */
}

@utility shadow-italianto {
  box-shadow: 0 4px 16px rgb(46 125 50 / 0.12);
}
```

---

## 🔐 Sistema de Autenticación (Clerk)

### Modo Preview (sin keys configuradas)
Cuando `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` no está en `.env.local`:
- `layout.tsx`: No envuelve con ClerkProvider (renderiza los hijos directamente)
- `header.tsx`: `SignedOut` muestra siempre los botones; `SignedIn` no muestra nada
- `studio/page.tsx`: `useUser` retorna `{ user: null }`
- `middleware.ts`: Pass-through, todas las rutas son accesibles

### Modo Producción (con keys)
Descomentar en `src/middleware.ts` el bloque de Clerk comentado y reactivar el ClerkProvider normal.

### Rutas protegidas (cuando Clerk está activo)
| Ruta | Acceso |
|------|--------|
| `/` `/pricing` `/about` `/privacy` `/terms` `/cookies` | Público |
| `/sign-in` `/sign-up` | Solo sin sesión |
| `/subscribe` | Autenticado (sin suscripción) |
| `/studio` | Autenticado + suscripción activa |
| `/api/translate` `/api/generate-audio` | Autenticado + suscripción activa |
| `/api/stripe/webhook` | Público (verificado por firma Stripe) |

---

## 💳 Sistema de Pagos (Stripe)

### Precio
- **Plan único:** $4.99 USD / mes, recurrente
- Sin períodos de prueba (según decisión del 2026-03-02)
- Cancela en cualquier momento

### Flujo completo
```
1. Usuario hace sign-up (Clerk)
2. Redirigido a /subscribe (CLERK_AFTER_SIGN_UP_URL=/subscribe)
3. Click "Suscribirme" → POST /api/stripe/checkout
4. API crea/recupera Stripe Customer, genera Checkout Session
5. Usuario paga en Stripe (modo test: tarjeta 4242 4242 4242 4242)
6. Stripe envía evento checkout.session.completed
7. Webhook /api/stripe/webhook → crea registro en Supabase
8. Usuario redirigido a /studio?subscribed=true
9. Studio verifica suscripción en cada llamada a API
```

### Eventos webhook configurados
- `checkout.session.completed` → crea suscripción en Supabase
- `customer.subscription.updated` → actualiza estado
- `customer.subscription.deleted` → marca como cancelada

### Testing local del webhook
```bash
# Instalar Stripe CLI y ejecutar:
stripe listen --forward-to localhost:3000/api/stripe/webhook
# La CLI genera el STRIPE_WEBHOOK_SECRET para desarrollo local
```

---

## 🗄️ Base de Datos (Supabase)

### Schema (ejecutar en Supabase SQL Editor)
Archivo: `supabase/schema.sql`

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios sincronizados desde Clerk. PK = Clerk user ID |
| `subscriptions` | Suscripciones de Stripe. PK = Stripe subscription ID |
| `dialogues` | Historial de diálogos generados (para uso futuro) |

### Row Level Security
Todas las tablas tienen RLS activado. Solo el `service_role` puede escribir (usado desde los webhooks y APIs del servidor). Los clientes no tienen acceso directo.

---

## 🗣️ Flujo de Generación de Diálogos

### Pasos en el Studio (`/studio`)
```
PASO 1 — Ingresar texto
  Usuario escribe o pega el diálogo en español o inglés.
  Mínimo 20 caracteres. Selecciona idioma fuente (ES / EN).

PASO 2 — Configurar personajes
  Mínimo 2, máximo 6 personajes.
  Cada uno tiene: nombre, género (M/F), voz ElevenLabs.
  Los nombres aquí son los que aparecen en el resultado final.

PASO 3 — Elegir formato de salida
  Opción A: Diálogo Escrito → texto formateado "Nombre. frase en italiano"
  Opción B: Audio Conversacional → MP3 con voces naturales (sin leer nombres)

PASO 4 — Resultado
  Escrito: texto copiable con botón de copiar al portapapeles
  Audio: player + botón de descarga MP3
```

### APIs involucradas
```
POST /api/translate
  Input:  { text, sourceLang, characters[] }
  Output: { lines: [{ name, text }], _mock?: true }
  Modo:   TRANSLATION_MODE=mock → respuesta prefabricada (sin costo)
          TRANSLATION_MODE=live → Claude Haiku (costo real)

POST /api/generate-audio
  Input:  { lines: [{ name, text }], characters[] }
  Output: { audioContent: base64, lines: number }
  Proceso: genera MP3 por línea (ElevenLabs), concatena con silencio entre líneas
```

---

## 🎙️ Voces ElevenLabs Configuradas

### Masculinas (género M)
| Nombre | Voice ID |
|--------|---------|
| Adam | `pNInz6obpgDQGcFmaJgB` |
| Arnold | `VR6AewLTigWG4xSOukaG` |
| Antoni | `ErXwobaYiN019PkySvjV` |
| Josh | `TxGEqnHWrfWFTfGW9XjX` |
| Sam | `yoZ06aMxZJJ28mfd3POQ` |

### Femeninas (género F)
| Nombre | Voice ID |
|--------|---------|
| Bella | `EXAVITQu4vr4xnSDxMaL` |
| Elli | `MF3mGyEYCl7XYWbV9V6O` |
| Rachel | `21m00Tcm4TlvDq8ikWAM` |
| Domi | `AZnzlk1XvdvUeBnXmlld` |
| Dorothy | `ThT5KcBeYPX3keUQqHPh` |

Modelo usado: `eleven_multilingual_v2`
Configuración de voz: stability 0.5 / similarity_boost 0.75 / style 0.2 / speaker_boost true

---

## 📱 APK con Capacitor

El APK es un wrapper nativo que carga la URL de Netlify en producción. No requiere build estático.

### Proceso de generación
```bash
# 1. Hacer deploy en Netlify primero
# 2. Actualizar la URL en capacitor.config.ts (server.url para isProd)

# 3. Agregar plataforma Android (solo la primera vez)
npx cap add android

# 4. Sincronizar en cada cambio
npx cap sync

# 5. Abrir en Android Studio
npx cap open android
# Luego: Build → Generate Signed Bundle / APK
```

### Configuración actual (capacitor.config.ts)
- App ID: `com.italianto.dialoguestudio`
- App Name: `Italianto Dialogue Studio`
- Splash screen: verde `#2e7d32`, 2 segundos
- Producción: carga `https://dialogue-studio.italianto.com` (actualizar con URL real de Netlify)
- Desarrollo: carga `http://localhost:3000`

---

## 🚀 Deploy en Netlify

### Configuración (netlify.toml)
- Build command: `npm run build`
- Publish dir: `.next`
- Plugin: `@netlify/plugin-nextjs`
- Node: 20
- Headers de seguridad aplicados globalmente
- Webhook de Stripe sin caché

### Pasos de deploy
```bash
# 1. Conectar repositorio en app.netlify.com → New site → Import from Git
# 2. Configurar variables de entorno en Netlify (Site settings → Environment variables)
#    Copiar TODAS las variables de env.example con valores reales
# 3. Cambiar NEXT_PUBLIC_APP_URL a la URL de Netlify
# 4. Deploy automático con cada push a master
# 5. Actualizar webhook de Stripe con la URL real de Netlify
```

---

## 🔧 Variables de Entorno

### Archivo: `env.example` (plantilla pública en Git)
### Archivo: `.env.local` (valores reales, NUNCA subir a Git)

| Variable | Servicio | Obligatoria | Notas |
|----------|---------|-------------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | En prod | Sin ella: modo preview |
| `CLERK_SECRET_KEY` | Clerk | En prod | |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk | En prod | Valor: `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk | En prod | Valor: `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Clerk | En prod | Valor: `/subscribe` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Clerk | En prod | Valor: `/subscribe` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | En prod | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | En prod | |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | En prod | Secreto, solo servidor |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | En prod | |
| `STRIPE_SECRET_KEY` | Stripe | En prod | Secreto, solo servidor |
| `STRIPE_WEBHOOK_SECRET` | Stripe | En prod | Secreto, solo servidor |
| `STRIPE_PRICE_ID` | Stripe | En prod | ID del precio $4.99/mes |
| `NEXT_PUBLIC_APP_URL` | App | Siempre | `http://localhost:3000` en dev |
| `ELEVENLABS_API_KEY` | ElevenLabs | Siempre | Ya configurada |
| `ANTHROPIC_API_KEY` | Anthropic | Solo live | No necesaria en mock |
| `TRANSLATION_MODE` | App | Siempre | `mock` (testing) / `live` (prod) |

---

## 📄 Páginas Legales

Requeridas para META Ads, Amazon App Store, Apple App Store y GDPR.

| Página | Ruta | URL pública |
|--------|------|-------------|
| Política de Privacidad | `/privacy` | Requerida por todas las tiendas y META |
| Términos y Condiciones | `/terms` | Requerida por Amazon y Apple |
| Política de Cookies | `/cookies` | Requerida por GDPR (UE) |
| Sobre Nosotros | `/about` | Recomendada para tiendas |

Contacto legal configurado: `legal@italianto.com` / `privacy@italianto.com`

---

## 🐛 Problemas Conocidos y Soluciones

### 1. Hot reload no funciona en WSL2
**Problema:** Next.js no detecta cambios en archivos de `/mnt/c/` (disco Windows).
**Solución:** Reiniciar el servidor manualmente tras cada cambio:
```bash
rm -rf .next && npm run dev
```

### 2. peer-deps React 19 vs Clerk
**Problema:** `npm install` falla con conflicto de peer deps entre React 19.1.0 y @clerk/nextjs.
**Solución:** Siempre usar `npm install --legacy-peer-deps`. Ya configurado en `.npmrc`.

### 3. Tailwind v4 sin PostCSS
**Problema:** Sin `postcss.config.mjs` y `@tailwindcss/postcss`, Tailwind no procesa nada → solo texto sin estilos.
**Solución:** Ambos ya están configurados. Si vuelve a ocurrir, verificar que `postcss.config.mjs` exista.

### 4. Clerk sin keys en desarrollo
**Problema:** `ClerkProvider` crashea si no hay `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
**Solución:** El layout, header, studio y middleware son condicionales. Sin la key, todo funciona en modo preview (sin auth).

### 5. Tailwind v4: colores personalizados no aplican
**Problema:** En v4, `tailwind.config.ts` no registra colores para las clases utilitarias.
**Solución:** Los colores están en `@theme {}` dentro de `globals.css`. Las sombras personalizadas están en `@utility {}`.

---

## 📋 Setup Completo para Nuevo Desarrollador

```bash
# 1. Clonar repositorio
git clone https://github.com/Mario24874/dialogue-studio.git
cd dialogue-studio

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con los valores reales

# 4. Ejecutar schema en Supabase
# Supabase Dashboard → SQL Editor → pegar supabase/schema.sql → Run

# 5. Crear producto en Stripe
# Dashboard → Products → Add product → $4.99/mes → copiar price ID

# 6. Iniciar en modo preview (sin auth, traducción mock)
npm run dev
# Abrir http://localhost:3000

# 7. Para testing completo con auth y pagos:
# - Agregar keys de Clerk en .env.local
# - Agregar keys de Stripe en .env.local
# - Agregar keys de Supabase en .env.local
# - Restaurar middleware.ts con Clerk activo
# - Usar stripe CLI para el webhook local:
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🗓️ Registro de Cambios

### [2026-03-02] — Claude Code Agent — Refactorización completa + Setup

**Sesión 1: Análisis y planificación**
- Revisión del estado previo del proyecto (Bootstrap + Google Cloud TTS + MagicUI parcial)
- Definición del nuevo stack: Clerk + Supabase + Stripe + Claude + ElevenLabs + Capacitor
- Decisión: suscripción de pago único $4.99/mes (sin free tier)
- Decisión: usar Claude Haiku para traducción (económico y rápido)

**Sesión 2: Implementación**
- Eliminadas: Bootstrap, react-bootstrap, @google-cloud/text-to-speech, MagicUI manual
- Instaladas: @clerk/nextjs, @supabase/supabase-js, stripe, @anthropic-ai/sdk, @capacitor/core, @capacitor/android, lucide-react, zustand, react-hook-form, zod, @tailwindcss/postcss
- `ItaliantoApp/` agregado a `.gitignore`
- `.npmrc` con `legacy-peer-deps=true`
- Tailwind v4 configurado correctamente con `postcss.config.mjs` + colores en `@theme`
- Landing page completa con identidad Italianto: hero con `coliseo.jpg`, features, how-it-works, pricing, CTA
- Header con logo 52×52px, nav responsive, Clerk UserButton condicional
- Footer verde oscuro con franja bandera italiana y links legales
- Studio de 4 pasos: input → personajes → formato → resultado
- `CharacterBuilder`: hasta 6 personajes con nombre, género, voz ElevenLabs
- Voces ElevenLabs: 5 masculinas (Adam, Arnold, Antoni, Josh, Sam) + 5 femeninas (Bella, Elli, Rachel, Domi, Dorothy)
- APIs: `/api/translate`, `/api/generate-audio`, `/api/subscription`
- Stripe: `/api/stripe/checkout` + `/api/stripe/webhook` (3 eventos)
- Supabase: schema con tablas `users`, `subscriptions`, `dialogues` + RLS
- Páginas legales: Privacy, Terms, Cookies, About, Pricing
- Pages auth: `/sign-in`, `/sign-up` con logo Italianto
- Página `/subscribe` con card de precio y features
- Capacitor configurado (APK wrapper → URL Netlify)
- `netlify.toml` con headers de seguridad y plugin Next.js
- Modo condicional sin Clerk (preview local sin keys)
- `env.example` (plantilla pública), `.env.local` (valores reales, en .gitignore)

**Sesión 3: Git + Modo Mock + Documentación**
- Repositorio vinculado: `https://github.com/Mario24874/dialogue-studio.git`
- Commit inicial: 39 archivos, 6415 inserciones
- `TRANSLATION_MODE=mock`: modo de traducción sin API de Claude para testing
- Modo mock: genera líneas alternas con frases italianas de ejemplo
- Modo live: importación dinámica de Anthropic SDK (solo se carga cuando es necesario)
- Archivos obsoletos eliminados: INSTRUCCIONES_FINALES.md, SOLUCION_*.md, fix-windows-error.md, start-server.*
- Commits en Git: `5e44c55` (refactorización) + `7c1dffd` (modo mock)
- Este documento actualizado con documentación completa

---

### [2026-03-03] — Claude Code Agent — Fix build Netlify

**Sesión 4: Corrección de errores de build y deploy**

**Errores ESLint (bloqueaban compilación):**
- `@typescript-eslint/no-explicit-any` → reemplazado por `error: unknown` con `instanceof Error` en todos los catch blocks
- `prefer-const` → `let { data: user }` → `const` en stripe/checkout
- `react/no-unescaped-entities` → comillas `"texto"` → `&ldquo;texto&rdquo;` en privacy, terms, studio
- `react/display-name` → `// eslint-disable-next-line` en stubs de Clerk (header, studio)
- Imports no usados eliminados: `Mic`, `User`, `router`, `Icon`, `NextRequest`

**Errores de build — SDK initialization eagerly:**

El error `supabaseUrl is required` y `Neither apiKey nor config.authenticator provided` ocurrían porque Next.js evalúa los módulos durante la fase *"Collecting page data"* del build, ejecutando código a nivel de módulo sin las env vars disponibles.

- `supabase.ts`: eliminado `export const supabase = createClient(...)` a nivel de módulo → reemplazado por `createBrowserClient()` lazy
- `stripe.ts`: eliminado `export const stripe = new Stripe(...)` a nivel de módulo → reemplazado por `getStripe()` lazy singleton
- Rutas que usaban `stripe.*` → actualizadas a `getStripe().*`
- Todas las rutas API: agregado `export const dynamic = "force-dynamic"` como protección adicional

**Error de seguridad — CVE-2025-55182:**

Netlify bloqueó el deploy porque Next.js 15.4.7 tiene una vulnerabilidad crítica.
- `next`: `15.4.7` → `15.4.11` (primer patch seguro de la rama 15.4.x)
- `eslint-config-next`: `15.4.7` → `15.4.11` (debe coincidir con Next.js)
- `package-lock.json` actualizado desde filesystem Linux nativo (workaround para WSL2 EACCES en `@next/swc-linux-x64-gnu`)

**Commits de esta sesión:**
- `23aefd8` — docs: PROJECT_CONTEXT.md documentación completa
- `779fe64` — fix: errores ESLint
- `51cad8a` — fix: Supabase lazy (supabaseUrl is required)
- `cccd93d` — fix: Stripe lazy + force-dynamic (Neither apiKey nor config.authenticator)
- `c05c539` — fix: Next.js 15.4.11 CVE-2025-55182

**Estado final: ✅ Build exitoso + Deploy exitoso en Netlify**

---

## ⏭️ Próximos Pasos

### Inmediato — Configurar credenciales de producción
1. **Clerk** → crear app en dashboard.clerk.com → copiar 2 keys → agregar a Netlify env vars y `.env.local`
2. **Supabase** → crear proyecto → ejecutar `supabase/schema.sql` → copiar 3 keys
3. **Stripe** → crear producto $4.99/mes → copiar price ID y 3 keys → configurar webhook
4. **Restaurar middleware Clerk** → descomentar bloque en `src/middleware.ts`
5. **ElevenLabs** → obtener API key → agregar a Netlify env vars
6. **Probar flujo completo** con `TRANSLATION_MODE=mock` + tarjeta Stripe `4242 4242 4242 4242`
7. **Activar Claude** → API key → cambiar `TRANSLATION_MODE=live`
8. **Capacitor** → actualizar URL en `capacitor.config.ts` → generar APK

### Próxima sesión — Nuevas funcionalidades planificadas
| Funcionalidad | Descripción | Prioridad |
|--------------|-------------|-----------|
| **Selector de idioma de UI** | Cambiar la interfaz entre Español / Italiano / Inglés (i18n) | Alta |
| **Límites de generación** | Replanteamiento del sistema de cuotas (diálogos/mes según plan) | Alta |
| **Planes múltiples** | Ej: Básico (50 diálogos/mes), Pro (ilimitado), Anual | Alta |
| **Sistema de cupones** | Códigos de descuento via Stripe Promotions | Media |
| **Modo oscuro** | Dark mode con Tailwind v4 + persistencia en localStorage | Media |
| **Configuración de perfil** | Nombre, avatar, idioma preferido, plan actual, historial | Media |
| **Historial de diálogos** | Tabla `dialogues` ya existe en Supabase, falta UI | Media |
| **Stripe Customer Portal** | Portal para gestionar/cancelar suscripción | Media |
| **Preview de voces** | Botón para escuchar muestra de cada voz ElevenLabs | Baja |
| **Descarga PDF/TXT** | Exportar diálogo escrito en múltiples formatos | Baja |
| **Amazon App Store** | Publicar APK en tienda Amazon | Baja |

### Notas de arquitectura para próximas features

**i18n (selector de idioma):**
- Usar `next-intl` o `react-i18next` con detección automática del navegador
- Guardar preferencia en Supabase `users.preferred_language`
- 3 idiomas: `es` (default), `it`, `en`
- Las traducciones de la UI en archivos `messages/es.json`, `messages/it.json`, `messages/en.json`

**Planes múltiples:**
- Crear 3 prices en Stripe (mensual Básico, mensual Pro, anual Pro)
- Agregar campo `plan_type` y `dialogues_used_this_month` en tabla `subscriptions`
- Reset del contador el 1 de cada mes (cron job en Netlify o Supabase Edge Function)
- Middleware que verifica cuota antes de permitir generación

**Modo oscuro:**
- Tailwind v4 soporta dark mode con `@variant dark { ... }` en globals.css
- Usar `data-theme` attribute en `<html>` + localStorage para persistencia
- Toggle en el header y en configuración de perfil
