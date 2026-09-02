// Déclaration des collections de contenu.
// Le contenu vit dans le dossier `content/` à la racine du dépôt, en Markdown et JSON,
// pour rester éditable avec un simple éditeur de texte.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/pages' }),
	schema: z.object({
		titre: z.string(),
	}),
});

export const collections = { pages };
