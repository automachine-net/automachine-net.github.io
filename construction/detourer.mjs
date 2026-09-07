// Détourage automatique des rendus de machines, avant chaque construction.
//
// Un rendu sorti de Fusion arrive avec la machine au milieu d'un grand cadre transparent :
// la bobineuse ESRF n'occupait qu'un tiers de la largeur de son fichier. Affichée telle
// quelle, l'image aurait paru petite et floue. Ce script retire les marges transparentes et
// laisse une marge fine et régulière autour de la machine.
//
// Il ne touche qu'aux PNG à fond transparent de src/images/machines, et il ne réécrit un
// fichier que si ses marges changent : le relancer sur une image déjà détourée ne fait rien.
// Il s'appuie sur la bibliothèque d'images qu'Astro utilise déjà, aucune dépendance en plus.
//
// Lancé par `npm run build` et `npm run dev` (voir package.json). Un rendu déposé depuis
// l'administration est donc détouré à la publication suivante, sans intervention.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DOSSIER = 'src/images/machines';
/** Marge conservée autour de la machine, en proportion de son plus grand côté. */
const MARGE = 0.02;
/** En dessous de cette opacité (sur 255), un pixel compte comme vide. */
const SEUIL = 8;
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

let noms;
try {
	noms = await fs.readdir(DOSSIER);
} catch {
	process.exit(0);
}

for (const nom of noms) {
	if (!/\.png$/i.test(nom)) continue;
	const fichier = path.join(DOSSIER, nom);
	const meta = await sharp(fichier).metadata();
	if (!meta.hasAlpha) continue;

	const { data, info } = await sharp(fichier)
		.trim({ threshold: SEUIL })
		.toBuffer({ resolveWithObject: true });
	const marge = Math.round(Math.max(info.width, info.height) * MARGE);
	const largeur = info.width + 2 * marge;
	const hauteur = info.height + 2 * marge;
	if (largeur === meta.width && hauteur === meta.height) continue;

	const sortie = await sharp(data)
		.extend({ top: marge, bottom: marge, left: marge, right: marge, background: TRANSPARENT })
		.png()
		.toBuffer();
	await fs.writeFile(fichier, sortie);
	console.log(`[detourer] ${nom} : ${meta.width}×${meta.height} → ${largeur}×${hauteur}`);
}
