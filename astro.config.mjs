// @ts-check
import { defineConfig } from 'astro/config';
// Extension officielle d'Astro : elle génère le plan du site (sitemap.xml) lu par les moteurs
// de recherche. Elle ne tourne qu'à la construction et n'ajoute rien dans le navigateur.
import sitemap from '@astrojs/sitemap';

// Adresse du site. Elle sert aux adresses canoniques, aux balises de partage et au plan du site.
// À changer le jour de la bascule vers le domaine définitif (voir docs/BASCULE.md).
const SITE = 'https://automachine-net.github.io';

// https://astro.build/config
export default defineConfig({
	site: SITE,
	trailingSlash: 'ignore',
	integrations: [
		sitemap({
			// Les maquettes du lot 1 et l'administration ne doivent pas figurer dans le plan du site.
			filter: (page) => !page.includes('/maquettes/') && !page.includes('/admin'),
		}),
	],
	build: {
		// Une page = un dossier avec index.html. C'est ce qu'attend un hébergement Apache
		// classique comme celui d'Infomaniak.
		format: 'directory',
	},
});
