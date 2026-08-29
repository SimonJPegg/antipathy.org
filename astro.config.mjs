import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.antipathy.org",
  integrations: [mdx(), sitemap()],
  output: "static",
  prefetch: true,
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
