// @ts-check
import { defineConfig } from 'astro/config';

// When you move to a custom domain, change `site` to that domain
// (for example https://masfiqreza.com) and add public/CNAME.
export default defineConfig({
  site: 'https://masfiq.github.io',
  build: {
    inlineStylesheets: 'always',
  },
});
