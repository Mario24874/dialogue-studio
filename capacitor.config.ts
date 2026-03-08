import type { CapacitorConfig } from "@capacitor/cli";

const isProd = process.env.NODE_ENV === "production";

const config: CapacitorConfig = {
  appId: "com.italianto.dialoguestudio",
  appName: "Dialogue Studio",
  // En producción apunta a Netlify; en desarrollo al localhost
  webDir: "out",
  server: isProd
    ? {
        // Reemplaza con tu URL de Netlify al hacer deploy
        url: "https://dialogue-studio.italianto.com",
        cleartext: false,
      }
    : {
        url: "http://localhost:3000",
        cleartext: true,
      },
  android: {
    backgroundColor: "#2e7d32",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2e7d32",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
};

export default config;
