// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// `site` is the production domain: it drives canonical
// URLs, Open Graph tags, the sitemap and llms.txt.
export default defineConfig({
  site: 'https://gtacheatcodes.xyz',
  trailingSlash: 'ignore',
  integrations: [react()],
  build: { format: 'directory' },
});
