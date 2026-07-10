import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Build estático para Cloudflare Pages
  output: 'static',
  // Adapter solo en producción
  adapter: process.env.NODE_ENV === 'production' ? cloudflare() : undefined,

  // Sitio final
  site: 'https://nio.gt',
});
