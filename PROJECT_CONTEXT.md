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
| Framework | Next.js | **15.4.11** | App Router (actualizado por CVE-2025-55182) |
| UI | React + TypeScript | 19.1.0 / 5.9.2 | |
| Estilos | Tailwind CSS v4 | 4.x | Config vía `@theme` en CSS, NO tailwind.config.ts |
| PostCSS | @tailwindcss/postcss | 4.x | **Requerido** para que Tailwind v4 funcione |
| Auth | Clerk (@clerk/nextjs) | 6.x | Condicional si no hay keys configuradas |
| Base de datos | Supabase | 2.x | PostgreSQL gestionado |
| Pagos | Stripe | 17.x | Suscripción $4.99/mes |
| Traducción IA (testing) | Google Gemini 2.0 Flash | gemini-2.0-flash | Primario; fallback a 1.5-flash (GEMINI_API_KEY) |
| Traducción IA (prod) | Anthropic Claude Haiku | claude-haiku-4-5-20251001 | Requiere ANTHROPIC_API_KEY |
| Audio TTS | ElevenLabs | eleven_multilingual_v2 | Voces por personaje |
| APK | Capacitor v7 | 7.x | Wrapper nativo que carga URL de Netlify |
| Deploy | Netlify | — | @netlify/plugin-nextjs, publish=".next" |
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
│   │   ├── admin/                        # Portal de administración (requiere ADMIN_EMAILS)
│   │   │   ├── layout.tsx                # Verifica isAdmin() → redirect si no es admin
│   │   │   ├── page.tsx                  # Dashboard con stats (client: fetch /api/admin/stats)
│   │   │   ├── _sidebar.tsx              # Sidebar de navegación admin
│   │   │   ├── users/page.tsx            # Lista de usuarios
│   │   │   ├── subscriptions/page.tsx    # Gestión de suscripciones
│   │   │   ├── dialogues/page.tsx        # Historial de diálogos generados
│   │   │   └── coupons/page.tsx          # Gestión de cupones
│   │   │
│   │   └── api/
│   │       ├── translate/route.ts         # Traducción: Gemini 2.0 Flash / Claude / mock
│   │       ├── generate-audio/route.ts    # Generación de audio MP3 (ElevenLabs)
│   │       ├── subscription/route.ts      # Verificar suscripción activa
│   │       ├── admin/                     # APIs admin (requieren isAdmin())
│   │       │   ├── stats/route.ts
│   │       │   ├── users/route.ts
│   │       │   ├── subscriptions/route.ts
│   │       │   ├── dialogues/route.ts
│   │       │   └── coupons/route.ts
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
│   │   ├── supabase.ts           # supabase client + createServiceClient() (lazy)
│   │   ├── stripe.ts             # stripe client + getStripe() (lazy singleton)
│   │   └── admin.ts              # isAdmin(userId) → verifica ADMIN_EMAILS env var
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
| `/admin` y `/admin/*` | Autenticado + email en `ADMIN_EMAILS` |
| `/api/admin/*` | Autenticado + `isAdmin()` = true |

### Portal de Administración
- **Acceso**: solo si el email del usuario está en la env var `ADMIN_EMAILS` (CSV)
- **Email superadmin**: `italiantonline@gmail.com`
- **Env var Netlify**: `ADMIN_EMAILS=italiantonline@gmail.com`
- **Sin esta var**: `isAdmin()` siempre retorna false → redirect silencioso a `/`
- El usuario debe estar registrado en Clerk (sign-up) para que Clerk conozca su email

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
- Build command: `npm run build && mkdir -p .next/_next && cp -r .next/static .next/_next/`
  - **El copy es crítico**: sin él, `/_next/static/` no existe en el CDN y todos los chunks dan 404
- Publish dir: `.next`
- Plugin: `@netlify/plugin-nextjs`
- Node: 20
- Headers de seguridad aplicados globalmente
- Cache inmutable para `/_next/static/*` (content-hashed)
- Webhook de Stripe sin caché

### ⚠️ Problema grave conocido: Netlify blob store eviction
El blob store de Netlify puede purgar blobs de builds anteriores. El delta-deployment no re-sube blobs que "cree" que existen. Síntoma: chunks dan 404 aunque el build sea exitoso. Los mismos hashes siguen apareciendo tras múltiples deploys.

**Solución definitiva**: borrar el proyecto Netlify y recrearlo (blob store nuevo). Todos los archivos se suben desde cero en el primer deploy. Ver sección de Registro de Cambios [2026-03-04] para el proceso completo.

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
| `TRANSLATION_MODE` | App | Siempre | `mock` (testing sin API) / ausente (usa ANTHROPIC o GEMINI) |
| `ADMIN_EMAILS` | App | Para admin | CSV de emails con acceso al portal admin. Ej: `italiantonline@gmail.com` |

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

---

### [2026-03-04] — Claude Code Agent — Fix chunks 404 + traducción funcional + documentación

**Contexto**: el sitio tenía chunks `/_next/static/chunks/*.js` dando 404 permanentemente en Netlify. Múltiples sesiones de debugging.

**Causa raíz confirmada**: Netlify blob store evicta blobs de builds anteriores. El delta-deployment omite re-subir blobs que "cree" que existen. Cuando esos blobs son purgados, los chunks dan 404 para siempre, independientemente de los deploys siguientes.

**Lo que se intentó (no funcionó)**:
- `Cache-Control: no-store` para `/*` → rompe CDN
- `force-dynamic` en root layout → rompe upload de chunks estáticos
- `hashSalt` en webpack → no afecta `contenthash`
- `/_next/static/*` → `/static/:splat` redirect → HTML 404
- `NEXT_PUBLIC_BUILD_TIME` como variable muerta → tree-shaking la elimina
- `generateBuildId` → no cambia contenthash de código sin cambios

**Fix definitivo aplicado**:
1. Borrado y recreación del proyecto Netlify → blob store nuevo → primer deploy sube todo desde cero ✅
2. En el proceso, se agregó `uuid` a `package.json` (peer dep de `svix`/Clerk faltante)
3. Build command en netlify.toml: `npm run build && mkdir -p .next/_next && cp -r .next/static .next/_next/` (garantiza path `/_next/static/`)

**Fix de `/api/translate` (500 post-recreación)**:
- Causa: `gemini-3-flash-preview` como modelo primario lanzaba errores no-quota → no hacía fallback
- Fix: cambiar orden a `["gemini-2.0-flash", "gemini-1.5-flash", "gemini-3-flash-preview"]`
- Fix: el loop de modelos ahora prueba TODOS ante cualquier error (no solo 429)
- Archivo: `src/app/api/translate/route.ts`

**Estado final**:
- ✅ Chunks cargan correctamente (nuevos hashes, nuevos blobs)
- ✅ Generación de diálogos escritos funciona
- ✅ Generación de audio funciona
- ⏳ Portal admin: requiere agregar `ADMIN_EMAILS=italiantonline@gmail.com` en Netlify env vars

**Commits de esta sesión**:
- `189913a` — fix: generateBuildId with timestamp
- `b214b74` — fix: force-dynamic on root layout (luego revertido)
- `70248f1` — fix: no-cache headers
- `8aaa2b0` — fix: add no-cache headers for HTML pages
- `35bde88` — fix: add manifest.json to public routes
- + commits adicionales de esta sesión (gemini model fix)

---

## ⏭️ Próximos Pasos

### Estado actual (2026-03-04)
✅ Deploy exitoso en https://dialogue-studio.netlify.app
✅ Clerk configurado (dev keys) — `ADMIN_EMAILS=italiantonline@gmail.com,marioivanmorenopineda@gmail.com`
✅ Supabase configurado (schema aplicado)
✅ Stripe configurado (test mode, webhook activo, plan $4.99/mes)
✅ ElevenLabs configurado
✅ Gemini configurado (AI Studio key, cuota gratuita) — modelo primario: `gemini-2.0-flash`
✅ Generación de diálogos escritos y audio funcionando
✅ Portal admin accesible (`/admin`) — stats, usuarios, suscripciones, diálogos, cupones
⏳ Anthropic Claude: pendiente (requiere créditos en console.anthropic.com)
⏳ Dominio propio + producción: pendiente
⚠️  Chunks prefetch 404 en Netlify (cosmético — páginas cargan bien via SSR, solo afecta prefetch)

---

## 🗺️ Roadmap de Funcionalidades

### PRIORIDAD ALTA — Planes y límites

#### 1. Reestructuración de planes Stripe
**Objetivo**: pasar de 1 plan a 3 opciones de suscripción.

| Plan | Precio | Límite | Acceso |
|------|--------|--------|--------|
| **Básico mensual** | $4.99/mes | 30 diálogos/mes | Solo Studio básico |
| **Ilimitado mensual** | $9.99/mes | Sin límite | Studio básico + Studio Avanzado |
| **Ilimitado anual** | ~$79.99/año (~$6.67/mes) | Sin límite | Studio básico + Studio Avanzado |

**Cambios requeridos**:
- Crear 3 precios en Stripe Dashboard (mantener el de $4.99 existente, crear 2 nuevos)
- Agregar campo `plan_type` (`basic` | `unlimited`) y `dialogues_used_this_month` (int) y `dialogues_reset_at` (date) en tabla `subscriptions` de Supabase
- Webhook Stripe: actualizar lógica para guardar `plan_type` según `price_id`
- Página `/subscribe`: mostrar los 3 planes con toggle mensual/anual
- API `/api/translate` y `/api/generate-audio`: verificar cuota antes de ejecutar
- Cron job mensual para reset de `dialogues_used_this_month` (Netlify Scheduled Functions o Supabase pg_cron)
- Portal admin: columna `plan_type` en vista de suscripciones

#### 2. Sistema de límites y cuotas
- Función `checkQuota(userId)` en `src/lib/quota.ts`: consulta Supabase, retorna `{ allowed: boolean, used: number, limit: number }`
- Llamar en `/api/translate` antes de procesar; retornar 403 con mensaje claro si cuota agotada
- UI en Studio: mostrar contador "X de 30 diálogos usados este mes" para plan Básico
- UI en Studio: badge "Ilimitado" para plan Pro

---

### PRIORIDAD ALTA — Studio Avanzado (exclusivo plan Ilimitado)

#### 3. Nueva sección: Studio Avanzado (`/studio/advanced`)
**Concepto**: el usuario puede subir un documento (texto, PDF o imagen con texto legible) O escribir texto directamente en español, inglés o italiano. La IA lo analiza y genera un diálogo según el tipo seleccionado.

**Tipos de diálogo disponibles**:
- 🎩 **Diálogo Formal** — lenguaje cuidado, cortés, profesional
- 💬 **Diálogo Informal** — conversacional, natural, coloquial
- 🔬 **Diálogo Técnico** — terminología específica del dominio del texto

**Flujos soportados**:
1. **ES/EN → Italiano**: traduce y genera diálogo del tipo elegido
2. **IT → IT**: texto ya en italiano, solo lo transforma al estilo elegido (formal/informal/técnico)
3. **Subir archivo**: extrae texto del archivo y luego aplica flujo 1 o 2

**Formatos de archivo soportados**:
- `.txt` — extracción trivial
- `.pdf` — librería `pdf-parse` o `pdfjs-dist` (server-side)
- `.jpg/.png/.webp` — OCR via Gemini Vision o Claude Vision (modelos multimodal)

**Restricción de acceso**: verificar `plan_type === 'unlimited'` antes de renderizar/procesar.

**Arquitectura propuesta**:
```
/studio/advanced/page.tsx          → UI del studio avanzado (force-dynamic, verifica plan)
/api/advanced-translate/route.ts   → Procesa input (texto o archivo) + genera diálogo tipado
/api/extract-text/route.ts         → Extrae texto de PDF/imagen (usado internamente)
```

**Pasos del flujo UI (4 pasos como el Studio básico)**:
1. Fuente del contenido: escribir texto | subir archivo (drag & drop)
2. Idioma de entrada + tipo de diálogo (Formal / Informal / Técnico)
3. Configurar personajes (igual que studio básico)
4. Resultado: diálogo escrito + opción de generar audio

#### 4. Estrategia para "alimentar a la IA" con ejemplos de estilo

**Recomendación: Few-shot prompting con ejemplos embebidos en el prompt**

Esta es la estrategia más costo-efectiva y flexible. En lugar de fine-tuning (caro, complejo) o RAG (necesita base vectorial), se incluyen 2-3 ejemplos de cada tipo de diálogo directamente en el system prompt:

```
EJEMPLOS DE DIÁLOGO FORMAL (de referencia):
Input: "Marco le dice a Sofia que la reunión se pospuso"
Output:
Marco. Gentile Sofia, Le comunico che la riunione prevista per oggi è stata posticipata.
Sofia. La ringrazio per la tempestiva comunicazione, Marco. Quando è prevista la nuova data?

EJEMPLOS DE DIÁLOGO INFORMAL:
Input: "Marco le dice a Sofia que la reunión se pospuso"
Output:
Marco. Ehi Sofia! La riunione di oggi salta, ci vediamo un altro giorno.
Sofia. Ah dai, ma quando?

EJEMPLOS DE DIÁLOGO TÉCNICO (dominio: medicina):
[ejemplo con terminología específica]
```

**Archivo de ejemplos**: `src/lib/dialogue-examples.ts` — exporta objetos con ejemplos por tipo. Fácil de expandir sin tocar la lógica de la API.

---

### PRIORIDAD MEDIA

| Funcionalidad | Descripción | Prioridad |
|--------------|-------------|-----------|
| **Selector de idioma de UI** | Interfaz en ES / IT / EN (next-intl o react-i18next) | Media |
| **Sistema de cupones** | Stripe Promotions API + UI de canje en `/subscribe` | Media |
| **Stripe Customer Portal** | Portal para gestionar/cancelar suscripción | Media |
| **Modo oscuro** | Tailwind v4 dark variant + toggle en header + localStorage | Media |
| **Configuración de perfil** | Nombre, avatar, idioma, plan actual, historial | Media |
| **Historial de diálogos** | Tabla `dialogues` ya existe en Supabase, falta UI en studio y admin | Media |
| **Preview de voces** | Botón para escuchar muestra de cada voz ElevenLabs | Baja |
| **Descarga PDF/TXT** | Exportar diálogo escrito en múltiples formatos | Baja |
| **Amazon App Store** | Publicar APK en tienda Amazon | Baja |

---

### Notas de arquitectura

**i18n (selector de idioma):**
- Usar `next-intl` o `react-i18next` con detección automática del navegador
- Guardar preferencia en Supabase `users.preferred_language`
- 3 idiomas: `es` (default), `it`, `en`
- Archivos: `messages/es.json`, `messages/it.json`, `messages/en.json`

**Modo oscuro:**
- Tailwind v4: `@variant dark { ... }` en globals.css
- `data-theme` en `<html>` + localStorage para persistencia
- Toggle en header y perfil

**Cron job reset de cuotas:**
- Opción A: Netlify Scheduled Functions (`netlify/functions/reset-quotas.ts` con schedule `0 0 1 * *`)
- Opción B: Supabase pg_cron (extensión PostgreSQL, más confiable)
- **Recomendado: Supabase pg_cron** — corre dentro de la DB, sin dependencia de Netlify

---

## 🧭 Agenda de Implementación — Guía para próximas sesiones

> **Principio rector**: construir en orden de dependencias. Los planes y límites son la base que habilita el Studio Avanzado. No implementar el Studio Avanzado antes de tener `plan_type` funcionando en Supabase y Stripe.

---

### FASE 1 — Planes y estructura Stripe (implementar primero)

**Objetivo**: pasar de 1 plan a 3, con `plan_type` guardado en Supabase.

#### Paso 1.1 — Stripe Dashboard (manual, sin código)
Crear 4 precios nuevos (mantener el de $4.99 existente):

**Productos y precios creados en Stripe (test mode) — 2026-03-05:**

| Env var | Price ID | Monto | Producto |
|---------|----------|-------|---------|
| `STRIPE_PRODUCT_ID_BASIC` | `prod_U57o8mdEXcESBY` | — | Studio Basic |
| `STRIPE_PRICE_ID_BASIC` | `price_1T6xYjIVhzJhQHiFWfLiq3b9` | $4.99/mes | Studio Basic |
| `STRIPE_PRICE_ID_BASIC_ANNUAL` | `price_1T6y2hIVhzJhQHiFDYzzMnvQ` | $39.99/año | Studio Basic |
| `STRIPE_PRODUCT_ID_STANDARD` | `prod_U5pIXWGGFlRA5W` | — | Studio Standard |
| `STRIPE_PRICE_ID_STANDARD_MONTHLY` | `price_1T7deCIVhzJhQHiFraUZGGsK` | $9.99/mes | Studio Standard |
| `STRIPE_PRICE_ID_STANDARD_ANNUAL` | `price_1T7df7IVhzJhQHiFzXKmGbIt` | $79.99/año | Studio Standard |
| `STRIPE_PRODUCT_ID_PRO` | `prod_U5pUDcUon4Q6t0` | — | Studio Pro |
| `STRIPE_PRICE_ID_PRO_MONTHLY` | `price_1T7dpBIVhzJhQHiFXPqeLnkG` | $19.99/mes | Studio Pro |
| `STRIPE_PRICE_ID_PRO_ANNUAL` | `price_1T7dpoIVhzJhQHiFyFogCPiC` | $159.99/año | Studio Pro |

**Mapeo product_id → plan_type (usado en webhook):**
- `prod_U57o8mdEXcESBY` → `basic`
- `prod_U5pIXWGGFlRA5W` → `standard`
- `prod_U5pUDcUon4Q6t0` → `pro`

- [x] Precios creados en Stripe Dashboard ✅
- [ ] Agregar las 9 env vars arriba a Netlify y `.env.local`

#### Paso 1.2 — Supabase: migración de schema
Ejecutar en Supabase SQL Editor:
```sql
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'basic'
    CHECK (plan_type IN ('basic', 'unlimited')),
  ADD COLUMN IF NOT EXISTS dialogues_used_this_month INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dialogues_reset_at TIMESTAMPTZ DEFAULT NOW();
```

#### Paso 1.3 — Código: webhook Stripe
Archivo: `src/app/api/stripe/webhook/route.ts`
- En `checkout.session.completed`: leer `price_id` del evento, mapear a `plan_type` (`basic` o `unlimited`), guardar en Supabase.
- En `customer.subscription.updated`: actualizar `plan_type` si cambia de plan.

#### Paso 1.4 — Código: lógica de cuotas
Archivo nuevo: `src/lib/quota.ts`
```typescript
// Funciones a implementar:
checkQuota(userId): Promise<{ allowed: boolean, used: number, limit: number, planType: string }>
incrementUsage(userId): Promise<void>
getPlanLimit(planType: string): number  // basic=30, unlimited=Infinity
```

#### Paso 1.5 — Código: APIs de generación con verificación de cuota
Archivos: `src/app/api/translate/route.ts` y `src/app/api/generate-audio/route.ts`
- Llamar `checkQuota(userId)` al inicio del handler
- Si `!allowed`: retornar 403 con mensaje "Has alcanzado tu límite de 30 diálogos este mes. Actualiza a plan Ilimitado."
- Después de generar con éxito: llamar `incrementUsage(userId)`

#### Paso 1.6 — Código: tabla de planes en `/pricing` y `/subscribe`
Archivos: `src/app/pricing/page.tsx` y `src/app/subscribe/page.tsx`

**Planes confirmados:**

| Plan | Mensual | Anual | Ahorro anual |
|------|---------|-------|-------------|
| Básico | $4.99/mes | — | — |
| Estándar | $9.99/mes | $79.99/año | 33% ($6.67/mes efectivo) |
| Pro | $19.99/mes | $159.99/año | 33% ($13.33/mes efectivo) |

**Funcionalidades por plan:**

| Funcionalidad | Básico | Estándar | Pro |
|---|:---:|:---:|:---:|
| Studio básico (texto escrito) | ✅ | ✅ | ✅ |
| Idiomas de entrada | ES/EN | ES/EN | ES/EN/IT |
| Diálogos escritos/mes | 20 | 80 | Ilimitado |
| Generación de audio/mes | 2 | 30 | Ilimitado |
| Personajes por diálogo | 2 | 4 | 6 |
| Historial de diálogos | ❌ | Últimos 60 | Ilimitado |
| Studio Avanzado (PDF/imagen) | ❌ | ❌ | ✅ |
| Tipo: Formal/Informal/Técnico | ❌ | ❌ | ✅ |
| IT → IT (transformar estilo) | ❌ | ❌ | ✅ |
| Exportar TXT | ❌ | ✅ | ✅ |
| Exportar PDF | ❌ | ❌ | ✅ |

**Requisitos de implementación:**
- Toggle "mensual / anual" con badge "Ahorra 33%" al activar anual
- Diseño moderno coherente con identidad Italianto (verde #2e7d32, franja bandera italiana)
- Textos multiidioma via `useLanguage()` + claves en `messages/es.json`, `it.json`, `en.json`
- Plan "Estándar" destacado como "Más popular" visualmente
- `/pricing` → enfoque marketing: visual, comparativo, CTA "Empezar ahora", accesible sin login
- `/subscribe` → enfoque funcional: usuario ya logueado, cada card con botón que llama a `POST /api/stripe/checkout` con el `price_id` del plan elegido

#### Paso 1.7 — UI Studio: indicador de cuota
Archivo: `src/app/studio/page.tsx`
- Fetch a nuevo endpoint `GET /api/subscription` (ya existe, extender para devolver `plan_type`, `used`, `limit`)
- Mostrar banner para plan Básico: "Diálogos usados: X / 30 este mes"
- Mostrar badge "Ilimitado ✓" para plan Pro

#### Paso 1.8 — Cron job: reset mensual
Opción recomendada — Supabase pg_cron (activar extensión en Supabase Dashboard → Extensions → pg_cron):
```sql
SELECT cron.schedule(
  'reset-monthly-dialogues',
  '0 0 1 * *',  -- a las 00:00 del día 1 de cada mes
  $$UPDATE subscriptions SET dialogues_used_this_month = 0, dialogues_reset_at = NOW()$$
);
```

---

### FASE 2 — Studio Avanzado (después de Fase 1 completa)

**Prerequisito**: `plan_type` en Supabase funcionando y verificado.

#### Paso 2.1 — Ejemplos de diálogo para few-shot prompting
Archivo nuevo: `src/lib/dialogue-examples.ts`
- Definir 3 ejemplos por tipo (Formal, Informal, Técnico)
- Cada ejemplo: `{ input, output, language }` — cubrir casos ES→IT, EN→IT, IT→IT
- Estos ejemplos se inyectan en el system prompt de la IA

#### Paso 2.2 — API: extracción de texto
Archivo nuevo: `src/app/api/extract-text/route.ts`
- `text/plain`: retorna el texto directamente
- `application/pdf`: usa `pdf-parse` (npm install pdf-parse)
- `image/*`: usa Gemini Vision (`gemini-2.0-flash` soporta imágenes, ya tenemos la API key)
- Límites: 5MB imágenes, 10MB PDFs, 50KB texto plano

#### Paso 2.3 — API: generación de diálogo avanzado
Archivo nuevo: `src/app/api/advanced-translate/route.ts`
- Input: `{ text, sourceLang, targetType: 'formal'|'informal'|'technical', characters[] }`
- Verificar `plan_type === 'unlimited'` (retornar 403 si es básico)
- Construir prompt con ejemplos de `dialogue-examples.ts` según `targetType`
- Reutilizar la lógica de Gemini/Claude de `/api/translate`

#### Paso 2.4 — UI: página Studio Avanzado
Archivo nuevo: `src/app/studio/advanced/page.tsx`
- Guard al inicio: si `plan_type !== 'unlimited'` → mostrar CTA de upgrade, no el studio
- Paso 1: Fuente → escribir texto | subir archivo (drag & drop con preview)
- Paso 2: Idioma entrada (ES/EN/IT) + tipo de diálogo (Formal/Informal/Técnico)
- Paso 3: Configurar personajes (reutilizar `CharacterBuilder`)
- Paso 4: Resultado → texto + botón generar audio (reutiliza `/api/generate-audio`)

#### Paso 2.5 — Navegación
- Agregar link "Studio Avanzado" en el header (visible solo si `plan_type === 'unlimited'`)
- O mostrar siempre con candado 🔒 → al hacer click muestra modal de upgrade

---

### Recomendaciones y principios para la implementación

1. **Orden estricto**: Fase 1 completa antes de Fase 2. `plan_type` es prerequisito de todo.
2. **Few-shot prompting sobre fine-tuning**: 3-4 ejemplos por tipo en el prompt son suficientes para Gemini 2.0 Flash y Claude Haiku. No se necesita fine-tuning (caro, lento) ni RAG (sobreingeniería).
3. **Gemini Vision para OCR de imágenes**: ya tenemos la API key. `gemini-2.0-flash` acepta imágenes directamente. No agregar Google Vision API por separado.
4. **pdf-parse para PDFs**: librería npm pura, sin APIs externas, funciona en Netlify serverless.
5. **Límite Básico = 30 diálogos/mes**: suficiente para probar, insuficiente para uso intensivo. Mostrar el contador visiblemente crea urgencia de upgrade.
6. **El contador debe mostrarse siempre** en el Studio para usuarios Básico: "Te quedan X de 30 diálogos". La visibilidad del límite es un mecanismo de conversión.
7. **Precio anual sugerido**: $79.99/año (33% de descuento vs $9.99×12=$119.88). Destacar el ahorro en la UI: "Ahorra $39 al año".
8. **Webhook primero**: sin el webhook actualizado que guarda `plan_type`, toda la Fase 1 falla. Es el primer archivo de código a modificar después de crear los precios en Stripe.
