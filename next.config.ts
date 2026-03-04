import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build ID único por deploy — fuerza que los chunk hashes cambien en cada build
  // evitando que Netlify CDN sirva archivos de deploys anteriores.
  generateBuildId: async () => `build-${Date.now()}`,
  poweredByHeader: false,
  images: {
    // Permite cargar imágenes desde el propio dominio
    remotePatterns: [],
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
  webpack: (config, { dev, isServer, buildId }) => {
    // Evitar problemas de symlinks en Windows
    if (dev && !isServer) {
      config.resolve.symlinks = false;
    }
    // Forzar que TODOS los chunk hashes cambien en cada deploy de producción.
    // Sin esto, Netlify's delta-deployment omite re-subir chunks con el mismo hash
    // aunque el CDN ya no los tenga → 404.
    // buildId cambia cada deploy gracias a generateBuildId: () => `build-${Date.now()}`
    if (!dev) {
      config.output.hashSalt = buildId;
    }
    return config;
  },
};

export default nextConfig;
