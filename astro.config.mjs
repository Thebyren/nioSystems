import { defineConfig } from 'astro/config';

export default defineConfig({
  // Build estático para Cloudflare Pages
  output: 'static',
  site: 'https://nio.gt',
});
