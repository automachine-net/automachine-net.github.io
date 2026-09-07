// Images de partage : la vignette qu'affichent les messageries et les réseaux quand on colle
// un lien du site.
//
// Deux familles, toutes en 1200 × 630, sans texte : le texte d'une vignette dépend des
// polices installées sur la machine qui la fabrique, et il serait différent d'un poste à
// l'autre. Le titre de la page est de toute façon affiché à côté par la plateforme.
//
// - `site.png` : le logo clair sur le bleu nuit de la charte, un filet orange. Sert à toutes
//   les pages qui n'ont pas d'image propre.
// - `machines/<slug>.png` : le rendu de la machine sur le gris clair, le logo en coin. Sert à
//   la fiche de chaque machine dont le rendu existe dans src/images/machines.
//
// Lancé à la main (`npm run partage`) après l'ajout d'un rendu, puis les fichiers produits
// sont ajoutés au dépôt : ce sont des images statiques comme les autres.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const LARGEUR = 1200;
const HAUTEUR = 630;
const BLEU_NUIT = { r: 31, g: 48, b: 68, alpha: 1 };
const GRIS_CLAIR = { r: 244, g: 243, b: 241, alpha: 1 };
const ORANGE = { r: 247, g: 159, b: 34, alpha: 1 };
const SORTIE = 'public/images/partage';

await fs.mkdir(path.join(SORTIE, 'machines'), { recursive: true });

// ---------------------------------------------------------------- Image générique
{
	const logo = await sharp('public/images/logo/fond-noir.svg')
		.resize({ width: 560 })
		.png()
		.toBuffer();
	const filet = await sharp({
		create: { width: 160, height: 6, channels: 4, background: ORANGE },
	})
		.png()
		.toBuffer();
	const { width: lw, height: lh } = await sharp(logo).metadata();
	await sharp({ create: { width: LARGEUR, height: HAUTEUR, channels: 4, background: BLEU_NUIT } })
		.composite([
			{
				input: logo,
				left: Math.round((LARGEUR - lw) / 2),
				top: Math.round((HAUTEUR - lh) / 2) - 20,
			},
			{
				input: filet,
				left: Math.round((LARGEUR - 160) / 2),
				top: Math.round((HAUTEUR + lh) / 2) + 30,
			},
		])
		.png()
		.toFile(path.join(SORTIE, 'site.png'));
	console.log('[partage] site.png');
}

// ---------------------------------------------------------------- Une image par machine
const petitLogo = await sharp('public/images/logo/avec-texte.svg')
	.resize({ width: 220 })
	.png()
	.toBuffer();
const { height: plh } = await sharp(petitLogo).metadata();
let rendus;
try {
	rendus = (await fs.readdir('src/images/machines')).filter((n) => /\.png$/i.test(n));
} catch {
	rendus = [];
}
for (const nom of rendus) {
	const slug = nom.replace(/\.png$/i, '');
	// La machine occupe au plus 80 % de la hauteur et 60 % de la largeur, centrée.
	const machine = await sharp(path.join('src/images/machines', nom))
		.resize({ width: Math.round(LARGEUR * 0.6), height: Math.round(HAUTEUR * 0.8), fit: 'inside' })
		.png()
		.toBuffer();
	const { width: mw, height: mh } = await sharp(machine).metadata();
	await sharp({ create: { width: LARGEUR, height: HAUTEUR, channels: 4, background: GRIS_CLAIR } })
		.composite([
			{ input: machine, left: Math.round((LARGEUR - mw) / 2), top: Math.round((HAUTEUR - mh) / 2) },
			{ input: petitLogo, left: 48, top: HAUTEUR - plh - 40 },
		])
		.png()
		.toFile(path.join(SORTIE, 'machines', `${slug}.png`));
	console.log(`[partage] machines/${slug}.png`);
}
