import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const BUILD_ID = new Date().toISOString().slice(0, 16).replace('T', ' ');

export default defineConfig({
  base: '/cleaning-app/',
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Use the manual manifest.webmanifest in public/ — keeps absolute paths
      // explicit for GitHub Pages base.
      manifest: false,
      injectRegister: 'auto',
      includeAssets: ['icons/**/*'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: '/cleaning-app/index.html',
        navigateFallbackDenylist: [/^\/cleaning-app\/icons\//],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
