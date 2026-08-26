import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const photos = defineCollection({
  loader: glob({ pattern: "*/index.mdx", base: "src/mdx" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      photo: image(),
      description: z.string().optional(),
    }),
});

export const collections = { photos };
