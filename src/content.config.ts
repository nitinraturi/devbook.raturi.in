import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				lastVerified: z.coerce.date().optional(),
				// Instruction files list their primary sources here; PageTitle renders them.
				sources: z.array(z.string()).optional(),
				// Path scoping for conditional instructions, read by Claude Code (paths) and Copilot (applyTo).
				paths: z.array(z.string()).optional(),
				applyTo: z.string().optional(),
			}),
		}),
	}),
	// Starlight always reads this collection (UI-string overrides in src/content/i18n/).
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
