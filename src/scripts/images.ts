// Déclinaisons modernes d'une image de contenu.
//
// L'éditeur ne dépose qu'un seul fichier dans le CMS. Si une version WebP a été préparée à
// côté, sous le même nom, elle est proposée en premier et le fichier d'origine sert de repli
// pour les navigateurs qui ne la lisent pas. Sinon, l'image est servie telle quelle : il n'y
// a rien à faire côté rédaction, et rien ne casse si les déclinaisons n'existent pas.
//
// La vérification a lieu à la construction du site, jamais dans le navigateur.
import fs from 'node:fs';

/** Chemin de la version WebP si le fichier existe dans public/, sinon null. */
export function versionWebp(src: string | undefined | null): string | null {
	if (!src || !src.startsWith('/')) return null;
	if (/\.webp$/i.test(src)) return null;
	const chemin = src.replace(/\.[a-z0-9]+$/i, '.webp');
	return fs.existsSync(`public${chemin}`) ? chemin : null;
}
