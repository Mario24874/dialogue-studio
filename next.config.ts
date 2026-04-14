import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/studio',
  // Build ID único por deploy — fuerza que los chunk hashes cambien en cada build
  // evitando que Netlify CDN sirva archivos de deploys anteriores.
  generateBuildId: async () => `build-${Date.now()}`,
  // Inyecta el timestamp de build en el bundle del cliente — cambia el contenthash
  // de los chunks que lo usan, forzando a Netlify a subir blobs nuevos al CDN.
  env: {
    NEXT_PUBLIC_BUILD_TIME: Date.now().toString(),
  },
  poweredByHeader: false,
  images: {
    // unoptimized=true porque el app corre detrás de un proxy inverso (italianto.com/studio).
    // Next.js standalone intenta hacer self-fetch usando el host header del request (italianto.com)
    // en vez de localhost, por lo que la optimización falla con "received null".
    unoptimized: true,
  },
  // Headers de seguridad adicionales
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    // Evitar problemas de symlinks en Windows
    if (dev && !isServer) {
      config.resolve.symlinks = false;
    }
    return config;
  },
};

export default nextConfig;
