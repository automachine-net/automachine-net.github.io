// Intégration Astro : une page en chantier n'est pas référencée.
//
// Après la construction, chaque page produite est relue. Si un marqueur de relecture y est
// encore visible, « [à relire] », « [À COMPLÉTER …] », « [À RÉDIGER] », « [MODULE À …] »,
// la page reçoit la balise qui l'écarte des moteurs de recherche et sort du plan du site.
// Le jour où le dernier marqueur disparaît du contenu, la page revient toute seule.
//
// On lit la page produite, pas les fichiers de contenu : c'est ce que le visiteur voit qui
// compte, d'où que vienne le texte, fichier de page, fiche machine ou données d'un outil.
//
// Le plan du site est élagué dans le même mouvement : toute page qui porte la balise
// « noindex », posée ici ou par la page elle-même, en est retirée. Cette intégration doit
// donc être déclarée après celle du plan du site dans astro.config.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Ce qui fait d'une page une page en chantier. Insensible à la casse et aux accents. */
export const MARQUEUR =
	/\[(?:à|a) ?(?:relire|compl[ée]ter|r[ée]diger|v[ée]rifier|valider)\b|\[(?:module|mod[èe]le 3d|visuel) [àa] /giu;

const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i;
const BALISE = '<meta name="robots" content="noindex, nofollow">';

export default function chantier() {
	return {
		name: 'chantier',
		hooks: {
			'astro:build:done': async ({ dir, pages, logger }) => {
				const racine = fileURLToPath(dir);
				const masquees = [];
				const nonReferencees = new Set();

				for (const { pathname } of pages) {
					const fichier = path.join(racine, pathname, 'index.html');
					let html;
					try {
						html = await fs.readFile(fichier, 'utf8');
					} catch {
						continue;
					}
					const chemin = '/' + pathname.replace(/\/$/, '');

					const trouves = html.match(MARQUEUR);
					if (trouves) {
						masquees.push({ chemin, nombre: trouves.length });
						if (!NOINDEX.test(html)) {
							html = html.includes('</head>')
								? html.replace('</head>', BALISE + '</head>')
								: BALISE + html;
							await fs.writeFile(fichier, html);
						}
					}
					if (NOINDEX.test(html)) nonReferencees.add(chemin);
				}

				await elaguerLePlanDuSite(racine, nonReferencees);

				if (masquees.length === 0) {
					logger.info('aucune page ne porte de marqueur : tout est référençable.');
					return;
				}
				masquees.sort((a, b) => a.chemin.localeCompare(b.chemin));
				logger.info(
					`${masquees.length} page(s) écartée(s) des moteurs, un marqueur de relecture y est encore visible :\n` +
						masquees.map((p) => `  ${p.chemin.padEnd(40)} ${p.nombre} marqueur(s)`).join('\n')
				);
			},
		},
	};
}

/** Retire des fichiers sitemap-N.xml toute adresse dont la page porte « noindex ». */
async function elaguerLePlanDuSite(racine, nonReferencees) {
	let noms;
	try {
		noms = (await fs.readdir(racine)).filter((n) => /^sitemap-\d+\.xml$/.test(n));
	} catch {
		return;
	}
	for (const nom of noms) {
		const fichier = path.join(racine, nom);
		const xml = await fs.readFile(fichier, 'utf8');
		const elague = xml.replace(/<url>.*?<\/url>/gs, (entree) => {
			const loc = entree.match(/<loc>([^<]*)<\/loc>/)?.[1] ?? '';
			const chemin = '/' + new URL(loc).pathname.replace(/^\/|\/$/g, '');
			return nonReferencees.has(chemin) ? '' : entree;
		});
		if (elague !== xml) await fs.writeFile(fichier, elague);
	}
}
