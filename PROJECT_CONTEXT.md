# PROJECT_CONTEXT.md — Italianto Dialogue Studio

## 🚨 INSTRUCCIÓN PARA DESARROLLADORES
**CADA DESARROLLADOR O AGENTE QUE TRABAJE AQUÍ DEBE ACTUALIZAR ESTE ARCHIVO**

---

## 📋 Resumen del Proyecto

**Italianto Dialogue Studio** es una aplicación web + APK (Android) que permite generar diálogos en italiano a partir de conversaciones en español o inglés, utilizando IA para la traducción (Claude) y síntesis de voz (ElevenLabs). Es un producto de pago por suscripción de la marca **Italianto**.

### Propósito
El usuario ingresa un diálogo en español o inglés, configura los personajes (nombre, género, voz), elige el formato de salida (escrito o audio) y genera el diálogo en italiano natural.

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + variables CSS personalizadas |
| Auth | Clerk (@clerk/nextjs) |
| Base de datos | Supabase (PostgreSQL) |
| Pagos | Stripe (suscripción mensual $4.99) |
| Traducción IA | Anthropic Claude (claude-haiku-4-5) |
| Audio TTS | ElevenLabs (eleven_multilingual_v2) |
| APK | Capacitor v7 (wrapper nativo que carga la URL de Netlify) |
| Deploy | Netlify |
| Instalación deps | `npm install --legacy-peer-deps` (React 19.1.0 ↔ Clerk peer dep) |

---

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── page.tsx                        # Landing page pública (Italianto branding)
│   ├── layout.tsx                      # Root layout con ClerkProvider
│   ├── globals.css                     # Variables CSS Italianto + Tailwind
│   ├── sign-in/[[...sign-in]]/page.tsx # Página de login (Clerk)
│   ├── sign-up/[[...sign-up]]/page.tsx # Página de registro (Clerk)
│   ├── subscribe/page.tsx              # Página de suscripción Stripe
│   ├── pricing/page.tsx                # Página de precios pública
│   ├── about/page.tsx                  # Sobre nosotros
│   ├── privacy/page.tsx                # Política de privacidad
│   ├── terms/page.tsx                  # Términos y condiciones
│   ├── cookies/page.tsx                # Política de cookies
│   ├── studio/page.tsx                 # App principal (protegida, 4 pasos)
│   └── api/
│       ├── translate/route.ts          # Claude API → traduce al italiano
│       ├── generate-audio/route.ts     # ElevenLabs → genera audio MP3
│       ├── subscription/route.ts       # Verifica suscripción activa
│       └── stripe/
│           ├── checkout/route.ts       # Crea Stripe Checkout Session
│           └── webhook/route.ts        # Procesa eventos Stripe
├── components/
│   ├── layout/
│   │   ├── header.tsx                  # Header con nav + Clerk UserButton
│   │   ├── footer.tsx                  # Footer con links legales
│   │   └── legal-layout.tsx            # Layout reutilizable para páginas legales
│   └── studio/
│       └── character-builder.tsx       # Configurador de personajes (nombre/género/voz)
├── lib/
│   ├── utils.ts                        # cn() helper (clsx + tailwind-merge)
│   ├── supabase.ts                     # Cliente Supabase + createServiceClient()
│   └── stripe.ts                       # Cliente Stripe
├── middleware.ts                       # Clerk middleware de protección de rutas
supabase/
└── schema.sql                          # Schema SQL para ejecutar en Supabase
capacitor.config.ts                     # Config Capacitor (apunta a Netlify en prod)
netlify.toml                            # Config deploy Netlify
.env.local.example                      # Variables de entorno necesarias
.npmrc                                  # legacy-peer-deps=true
```

---

## 🔧 Variables de Entorno Requeridas

Copiar `.env.local.example` → `.env.local` y completar:

| Variable | Servicio | Obtener en |
|----------|---------|-----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | dashboard.clerk.com |
| `CLERK_SECRET_KEY` | Clerk | dashboard.clerk.com |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | supabase.com/dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | supabase.com/dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | supabase.com/dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | dashboard.stripe.com |
| `STRIPE_SECRET_KEY` | Stripe | dashboard.stripe.com |
| `STRIPE_WEBHOOK_SECRET` | Stripe | dashboard.stripe.com/webhooks |
| `STRIPE_PRICE_ID` | Stripe | ID del precio mensual creado |
| `NEXT_PUBLIC_APP_URL` | — | URL de la app (localhost o Netlify) |
| `ANTHROPIC_API_KEY` | Anthropic | console.anthropic.com |
| `ELEVENLABS_API_KEY` | ElevenLabs | elevenlabs.io |

---

## 🚀 Setup Inicial

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Crear .env.local con las variables de entorno

# 3. Ejecutar schema SQL en Supabase
# Ir a Supabase Dashboard → SQL Editor → pegar contenido de supabase/schema.sql

# 4. Crear producto en Stripe (modo test)
# Dashboard → Products → Add Product → $4.99/month → copiar Price ID → .env.local

# 5. Configurar webhook de Stripe
# Dashboard → Webhooks → Add Endpoint
# URL: https://tu-app.netlify.app/api/stripe/webhook
# Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

# 6. Iniciar desarrollo
npm run dev
```

---

## 📱 Generación de APK (Capacitor)

El APK es un wrapper nativo que carga la URL de Netlify en producción. No requiere build estático.

```bash
# 1. Deploy en Netlify primero
# 2. Actualizar capacitor.config.ts con la URL de Netlify
# 3. Instalar Capacitor CLI si no está
npm install --legacy-peer-deps

# 4. Agregar plataforma Android
npx cap add android

# 5. Sincronizar
npx cap sync

# 6. Abrir en Android Studio
npx cap open android
# En Android Studio: Build → Generate Signed Bundle/APK
```

---

## 🎨 Identidad de Marca Italianto

```
Primary:      #2e7d32  (verde oscuro — italianto-800)
Primary Light: #4caf50 (verde — italianto-500)
Primary Dark:  #1b5e20 (verde muy oscuro — italianto-900)
Background:   #f5f5f5 (light)
Bandera:      verde #009246 | blanco | rojo #ce2b37
```

---

## 💳 Flujo de Suscripción

```
1. Usuario se registra (Clerk sign-up)
2. Redirigido a /subscribe
3. Click "Suscribirme" → POST /api/stripe/checkout → Stripe Checkout Session
4. Usuario completa pago en Stripe
5. Stripe envía webhook → /api/stripe/webhook
6. Webhook crea registro en Supabase (subscriptions table)
7. Usuario redirigido a /studio
8. Studio verifica suscripción → /api/subscription → Supabase
```

---

## 🗣️ Flujo de Generación de Diálogo

```
PASO 1: Usuario ingresa texto en ES/EN
PASO 2: Configura personajes (nombre + género + voz ElevenLabs)
PASO 3: Elige formato: escrito o audio
PASO 4: Click "Generar diálogo"
  → POST /api/translate (Claude Haiku traduce al italiano, devuelve [{name, text}])
  → Si escrito: formatea como "Nombre. texto en italiano"
  → Si audio: POST /api/generate-audio (ElevenLabs genera MP3 por personaje y los concatena)
```

---

## 🐛 Problemas Conocidos

1. **peer-deps React 19**: Usar siempre `--legacy-peer-deps` con npm
2. **Stripe Webhook local**: Para probar en local, usar Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. **Capacitor en modo dev**: Requiere URL de Netlify en producción; en dev apunta a localhost

---

## 📝 Registro de Cambios

### [2026-03-02] - Claude Code Agent - Refactorización Completa

**Cambios principales:**
- Eliminadas: Bootstrap, Google Cloud TTS, MagicUI manual
- Nuevo stack: Clerk + Supabase + Stripe + Claude API + Capacitor
- Identidad visual Italianto aplicada (colores #2e7d32, bandera italiana)
- Flujo de 4 pasos en el Studio (input → personajes → formato → resultado)
- Nombres reales de personajes en el diálogo generado (no A/B/C)
- Audio conversacional sin leer nombres (solo las voces)
- Páginas legales completas: Privacy, Terms, Cookies, About
- Capacitor configurado para APK (wrapper de URL Netlify)
- netlify.toml para deploy automático
- supabase/schema.sql con tablas users, subscriptions, dialogues
- .env.local.example con todas las variables documentadas

**Archivos eliminados:**
- src/components/magicui/ (5 componentes)
- src/components/voice-selector.tsx
- src/components/language-selector.tsx
- src/components/content-type-selector.tsx
- src/app/page-with-framer.tsx
- src/app/api/voices/route.ts

**ItaliantoApp agregado a .gitignore** ✅
