import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const gameKey = z.enum(['gta5', 'sa', 'vc', 'gta3', 'gta4']);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    /** Visible H1. */
    title: z.string(),
    /** <title> tag, ideally under 60 characters. */
    seoTitle: z.string(),
    /** Meta description, 140-160 characters. */
    description: z.string(),
    /** hub -> /{slug}/, guide -> /guides/{slug}/, tool -> /tools/{slug}/ */
    kind: z.enum(['hub', 'guide', 'tool']),
    /** Topic tag used for theming and grouping. */
    topic: z.enum(['gta5', 'sa', 'vc', 'gta3', 'gta4', 'lcs', 'vcs', 'ctw', 'de', 'gta6', 'online', 'general']),
    /** Short label above the H1. */
    kicker: z.string(),
    /** 40-80 word direct answer shown in a highlighted box (for featured snippets / AI answers). */
    quickAnswer: z.string(),
    keyTakeaways: z.array(z.string()).min(3).max(6),
    /** Cheat databases to embed as an interactive table. */
    cheatGames: z.array(gameKey).optional(),
    cheatCategory: z
      .enum(['health', 'weapons', 'wanted', 'vehicles', 'player', 'world', 'traffic', 'peds', 'fun'])
      .optional(),
    defaultPlatform: z.enum(['ps', 'xbox', 'pc', 'phone', 'switch']).optional(),
    /** Interactive tool to mount (tool pages only). */
    tool: z.enum(['finder', 'trainer', 'roulette']).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    /** Slugs (file names without .md) of related pages. */
    related: z.array(z.string()).default([]),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
  }),
});

export const collections = { pages };
