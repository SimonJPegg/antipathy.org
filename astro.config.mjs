import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://www.antipathy.org",
  integrations: [mdx()],
  adapter: cloudflare({ mode: "directory" }),
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
