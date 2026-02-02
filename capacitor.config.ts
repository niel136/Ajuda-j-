import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ajudaja.app',
  appName: 'AjudaJá',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Se quiser que o APK aponte sempre para a Vercel atualizada:
    url: "https://ajuda-ja.vercel.app",
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#F8FAF5"
  }
};

export default config;