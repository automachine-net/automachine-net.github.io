// Images de contenu : celles que les éditeurs déposent depuis le CMS.
//
// Elles sont rangées dans src/images/ et non dans public/ : c'est ce qui permet à Astro de
// les traiter à la construction. Chaque image est redimensionnée aux largeurs réellement
// affichées et déclinée en AVIF et WebP, le fichier d'origine servant de repli. L'éditeur
// dépose une photo brute de plusieurs mégaoctets, le visiteur en reçoit quelques dizaines
// de kilooctets à la bonne taille.
//
// Le CMS écrit dans le contenu un chemin de la forme /images/contenu/photo.jpg. Cette
// fonction retrouve le fichier correspondant dans src/images/. Si le fichier n'y est pas,
// par exemple une image ancienne restée dans public/, elle renvoie null et l'image est
// servie telle quelle : rien ne casse, elle n'est simplement pas optimisée.
import type { ImageMetadata } from 'astro';

const fichiers = import.meta.glob<{ default: ImageMetadata }>(
	'/src/images/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,avif,gif}',
	{ eager: true }
);

export function imageDeContenu(chemin: string | null | undefined): ImageMetadata | null {
	if (!chemin || !chemin.startsWith('/images/')) return null;
	return fichiers[`/src${chemin}`]?.default ?? null;
}
