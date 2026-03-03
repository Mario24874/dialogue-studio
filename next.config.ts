import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  webpack: (config, { dev, isServer }) => {
    // Evitar problemas de symlinks en Windows
    if (dev && !isServer) {
      config.resolve.symlinks = false;
    }
    return config;
  },
};

export default nextConfig;
