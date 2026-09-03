// @ts-check
import fs from 'node:fs';
import { defineConfig } from 'astro/config';
// Extension officielle d'Astro : elle génère le plan du site (sitemap.xml) lu par les moteurs
// de recherche. Elle ne tourne qu'à la construction et n'ajoute rien dans le navigateur.
import sitemap from '@astrojs/sitemap';

// Adresse du site. Elle sert aux adresses canoniques, aux balises de partage et au plan du site.
// À changer le jour de la bascule vers le domaine définitif (voir docs/BASCULE.md).
const SITE = 'https://automachine-net.github.io';

/**
 * Pages écrites en dur dans src/pages/ qui ne doivent pas être référencées.
 * Les modules qui ne sont pas encore en service en font partie.
 */
const PAGES_NON_REFERENCEES = ['/outils/simulateur-carbone', '/outils/reversibilite'];

/**
 * Pages de contenu dont la case « Masquer aux moteurs de recherche » est cochée dans le CMS.
 * Elles portent déjà une balise noindex ; les laisser dans le plan du site serait
 * contradictoire, et le moteur signalerait l'incohérence.
 */
function pagesMasqueesParLeCms() {
	const dossier = 'content/pages';
	if (!fs.existsSync(dossier)) return [];
	// Chaque page a sa propre route : l'accueil est à la racine, les autres portent le nom
	// de leur fichier (voir src/pages/[...slug].astro).
	const routes = { accueil: '/' };
	return fs
		.readdirSync(dossier)
		.filter((nom) => nom.endsWith('.md'))
		.filter((nom) => /^noindex:\s*true\s*$/m.test(fs.readFileSync(`${dossier}/${nom}`, 'utf8')))
		.map((nom) => {
			const id = nom.replace(/\.md$/, '');
			return routes[id] ?? `/${id}`;
		});
}

// https://astro.build/config
export default defineConfig({
	site: SITE,
	trailingSlash: 'ignore',
	integrations: [
		sitemap({
			filter: (page) => {
				const chemin = new URL(page).pathname.replace(/\/$/, '') || '/';
				// Les maquettes du lot 1 et l'administration ne sont pas des pages du site.
				if (chemin.startsWith('/maquettes') || chemin.startsWith('/admin')) return false;
				return ![...PAGES_NON_REFERENCEES, ...pagesMasqueesParLeCms()].includes(chemin);
			},
		}),
	],
	build: {
		// Une page = un dossier avec index.html. C'est ce qu'attend un hébergement Apache
		// classique comme celui d'Infomaniak.
		format: 'directory',
	},
});
