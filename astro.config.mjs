import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Build estático para Cloudflare Pages
  output: 'static',
  site: 'https://nio.gt',
  integrations: [sitemap()],
});
