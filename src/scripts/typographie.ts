// Typographie française appliquée automatiquement aux textes du site.
//
// En français, une espace précède les signes de ponctuation doubles (? ! ; :) et accompagne
// les guillemets. Cette espace doit être insécable, sinon le signe part seul à la ligne
// suivante, comme dans « Votre machine n'existe pas
// ? Nous la construisons. »
//
// Ces caractères sont introuvables sur un clavier ordinaire. Le site les pose donc lui-même :
// un éditeur tape une espace normale et obtient une typographie correcte.
//
// Les caractères invisibles sont écrits en codes \u… et jamais en clair : sans cela, personne
// ne peut relire ni modifier ce fichier de façon fiable.

/** Espace fine insécable : avant ? ! ; et à l'intérieur des guillemets. */
const FINE = ' ';
/** Espace insécable, plus large : avant les deux-points. */
const INSECABLE = ' ';
/** Apostrophe typographique, celle employée dans les textes du site. */
const APOSTROPHE = '’';
/** Toute espace, y compris celles déjà insécables. */
const ESPACES = '[ \\u00A0\\u202F]';

/** Champs dont la valeur n'est pas du texte affiché et ne doit surtout pas être modifiée. */
const CHAMPS_TECHNIQUES = new Set([
	'type',
	'fond',
	'image',
	'logo',
	'modele',
	'modele_3d',
	'slug',
	'machines',
	'colonnes',
	'module',
	'position_image',
]);

/** Applique les règles d'espacement français à un texte. */
export function typo(texte: string): string;
export function typo(texte: undefined | null): undefined;
export function typo(texte: string | undefined | null): string | undefined;
export function typo(texte: string | undefined | null): string | undefined {
	if (typeof texte !== 'string') return undefined;
	return (
		texte
			// Devant ? ! ; : espace fine insécable, qu'une espace ait été tapée ou non.
			.replace(new RegExp(`${ESPACES}*([?!;])`, 'g'), `${FINE}$1`)
			// Devant les deux-points : espace insécable, mais seulement si une espace était
			// déjà là, pour ne pas abîmer les adresses du type https://exemple.fr
			.replace(new RegExp(`${ESPACES}+:`, 'g'), `${INSECABLE}:`)
			// Guillemets français : l'espace intérieure est insécable.
			.replace(new RegExp(`«${ESPACES}*`, 'g'), `«${FINE}`)
			.replace(new RegExp(`${ESPACES}*»`, 'g'), `${FINE}»`)
			// Apostrophe droite du clavier → apostrophe typographique.
			.replace(/(\p{L})'(\p{L})/gu, `$1${APOSTROPHE}$2`)
	);
}

/**
 * Applique la typographie à toutes les chaînes d'une structure de données, en profondeur.
 * Les champs techniques (adresses, identifiants, chemins d'images) sont laissés intacts.
 */
export function typoProfond<T>(valeur: T, cle?: string): T {
	if (typeof valeur === 'string') {
		if (cle && (CHAMPS_TECHNIQUES.has(cle) || cle.endsWith('_url'))) return valeur;
		return typo(valeur) as T;
	}
	if (Array.isArray(valeur)) return valeur.map((v) => typoProfond(v, cle)) as T;
	if (valeur && typeof valeur === 'object') {
		const sortie: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(valeur)) sortie[k] = typoProfond(v, k);
		return sortie as T;
	}
	return valeur;
}
