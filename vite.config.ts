import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Endereço público usado nas tags de compartilhamento (og:image precisa de URL absoluta).
 * Na Vercel vem de VERCEL_PROJECT_PRODUCTION_URL; localmente pode ser definido em SITE_URL.
 */
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
  ],
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
  },
});
