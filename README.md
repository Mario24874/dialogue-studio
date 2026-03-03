# 🎭 Dialogue Studio

Una aplicación web moderna construida con **Next.js 15** que convierte guiones de texto en audio usando **ElevenLabs AI** y una interfaz elegante con **MagicUI**.

![Built with Next.js](https://img.shields.io/badge/Next.js-15.4.7-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-API-purple)
![MagicUI](https://img.shields.io/badge/MagicUI-Components-pink)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## ✨ Características

- **🎤 Generación de Audio Realista**: Utiliza ElevenLabs AI para voces naturales
- **👥 Soporte Multi-Personajes**: Diferentes voces para personajes masculinos y femeninos
- **🎨 Interfaz Moderna**: Componentes animados con MagicUI y Tailwind CSS
- **📱 Totalmente Responsiva**: Diseño adaptativo para todos los dispositivos
- **⚡ Tiempo Real**: Progreso animado durante la generación
- **🌙 Dark/Light Mode**: Soporte para temas claro y oscuro
- **📄 Carga de Archivos**: Sube archivos .txt o .md con tus guiones

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun
- Cuenta de [ElevenLabs](https://elevenlabs.io/) con API key

### 1. Clona el repositorio

```bash
git clone <tu-repo-url>
cd dialogue-studio
```

### 2. Instala dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### 3. Configura variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=tu_api_key_aqui
ELEVENLABS_API_URL=https://api.elevenlabs.io/v1
ELEVENLABS_VOICE_STABILITY=0.5
ELEVENLABS_VOICE_SIMILARITY_BOOST=0.75
ELEVENLABS_VOICE_STYLE=0.0
ELEVENLABS_VOICE_USE_SPEAKER_BOOST=true
```

### 4. Inicia el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📖 Uso

### Formato de Guión

Usa el siguiente formato en tus guiones:

```
Personaje (M/F): Diálogo

Ejemplo:
Ana (F): ¡Hola! ¿Cómo estás hoy?
Carlos (M): Muy bien, gracias por preguntar. ¿Y tú?
Ana (F): Excelente, tengo muchas cosas que contarte.
```

- **M** = Voz masculina (Adam)
- **F** = Voz femenina (Bella)

### Carga de Archivos

Soporta archivos `.txt` y `.md` con el formato de guión especificado.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 15 + React 19
- **Styling**: Tailwind CSS + MagicUI Components
- **Animaciones**: Framer Motion
- **Audio**: ElevenLabs Text-to-Speech API
- **TypeScript**: Tipado completo

### Estructura de Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── generate-audio/
│   │       └── route.ts        # API endpoint ElevenLabs
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página principal
│   └── globals.css             # Estilos globales
├── components/
│   └── magicui/                # Componentes MagicUI
│       ├── magic-card.tsx
│       ├── rainbow-button.tsx
│       ├── shimmer-button.tsx
│       ├── animated-circular-progress-bar.tsx
│       └── hyper-text.tsx
└── lib/
    └── utils.ts                # Utilidades
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter ESLint
```

## 🎨 Componentes MagicUI

### MagicCard
Tarjeta con efecto spotlight que sigue el cursor.

### RainbowButton
Botón con gradiente animado y efectos de hover.

### ShimmerButton
Botón con efecto shimmer sutil.

### AnimatedCircularProgressBar
Barra de progreso circular con animaciones.

### HyperText
Texto con efecto de scramble/reveal animado.

## 🔧 Configuración

### Voces ElevenLabs

Por defecto se usan estas voces:
- **Masculina**: Adam (`pNInz6obpgDQGcFmaJgB`)
- **Femenina**: Bella (`EXAVITQu4vr4xnSDxMaL`)

Puedes cambiarlas en `src/app/api/generate-audio/route.ts`.

### Personalización de Tema

Modifica las variables CSS en `src/app/globals.css` para personalizar colores y temas.

## 📚 Documentación Detallada

Consulta `PROJECT_CONTEXT.md` para documentación técnica completa, incluyendo:
- Registro detallado de cambios
- Problemas conocidos y soluciones
- Guías para desarrolladores
- Arquitectura técnica

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en Vercel
3. Deploy automático con cada push

### Variables de Entorno para Producción

Asegúrate de configurar estas variables en tu plataforma de deploy:

```
ELEVENLABS_API_KEY=tu_api_key_real
ELEVENLABS_API_URL=https://api.elevenlabs.io/v1
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
6. **IMPORTANTE**: Actualiza `PROJECT_CONTEXT.md` con tus cambios

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 💡 Soporte

Si tienes problemas o preguntas:

1. Revisa `PROJECT_CONTEXT.md` para soluciones comunes
2. Abre un issue en GitHub
3. Consulta la [documentación de ElevenLabs](https://docs.elevenlabs.io/)

---

**Desarrollado con ❤️ usando Next.js, ElevenLabs AI y MagicUI**
