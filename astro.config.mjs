// @ts-check
import { defineConfig } from 'astro/config';

// Live at the custom domain set in GitHub Settings > Pages (public/CNAME matches it).
export default defineConfig({
  site: 'https://masfiqreza.com',
  build: {
    inlineStylesheets: 'always',
  },
});
