import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    category: z.enum(['Web', 'App', '可视化']),
    tags: z.array(z.string()),
    order: z.number(),
    theme: z.string(),
    nodes: z.array(z.string()),
    source: z.url(),
  }),
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string(),
    source: z.url(),
  }),
});
const resources = defineCollection({
  loader: file('src/data/resources.json', {
    parser: (text) => {
      const rows = JSON.parse(text) as { id: string }[];
      const ids = rows.map((row) => row.id);
      if (new Set(ids).size !== ids.length) throw new Error('资源标识重复');
      return rows;
    },
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    useCase: z.string(),
    category: z.enum([
      'coding',
      'agents',
      'build',
      'models',
      'research',
      'creative',
    ]),
    tags: z.array(z.string()),
    website: z.url(),
    docs: z.url().optional(),
    repository: z.url().optional(),
    checkedAt: z.iso.date(),
    featuredOrder: z.number().int().positive().optional(),
  }),
});
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    resources: z.array(z.string()),
    checkedAt: z.iso.date(),
  }),
});
export const collections = { projects, notes, resources, guides };
