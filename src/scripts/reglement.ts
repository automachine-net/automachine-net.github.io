// Liens vers le texte officiel du règlement (UE) 2023/1230 sur EUR-Lex.
//
// Le format des ancres a été vérifié sur la page elle-même le 3 septembre 2026 : chaque
// article porte un identifiant « art_N ». Si EUR-Lex changeait ce format, le lien mènerait
// au début du texte plutôt qu'à l'article : gênant, jamais cassé.

const TEXTE = 'https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32023R1230';

/**
 * Adresse de l'article cité, à partir d'une référence du type « art. 10, § 7 »
 * ou « art. 3, point 1 d) ». Renvoie le texte complet si aucun numéro n'est lisible.
 */
export function lienArticle(reference: string): string {
	const numero = reference.match(/(\d+)/);
	return numero ? `${TEXTE}#art_${numero[1]}` : TEXTE;
}

/** Référence mise en forme pour l'affichage : « art. 10, § 7 » devient « article 10, § 7 ». */
export function libelleArticle(reference: string): string {
	return reference.replace(/^art\.\s*/i, 'article ');
}
