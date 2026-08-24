import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const photos = defineCollection({
  loader: glob({ pattern: "*/index.mdx", base: "src/mdx" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    photo: z.string(),
  }),
});

export const collections = { photos };
