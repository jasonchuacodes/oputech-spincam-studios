import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  server: {
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['assets/brand/icon-apple-touch-180.png'],
      manifest: {
        name: 'spincam',
        short_name: 'spincam',
        description: 'spincam',
        theme_color: '#2BB6C4',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'assets/brand/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/brand/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'assets/brand/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2}'],
        globIgnores: ['**/logo-source.png'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

