// Deux gestes que tous les modules interactifs partagent.
//
// Un module peut être posé plusieurs fois dans une même page, par le bloc « module » du CMS.
// Son script ne doit donc jamais chercher « le » formulaire ou « le » résultat dans la page
// entière : il monte chaque exemplaire séparément, et cherche ses éléments à l'intérieur de
// cet exemplaire seulement.

/**
 * Monte un module sur chacun de ses exemplaires présents dans la page. Le sélecteur désigne
 * la racine d'un exemplaire ; la fonction reçoit cette racine et ne regarde qu'en dessous.
 */
export function chaqueExemplaire<T extends HTMLElement = HTMLElement>(
	selecteur: string,
	monter: (racine: T) => void
): void {
	document.querySelectorAll<T>(selecteur).forEach((racine) => monter(racine));
}

/**
 * Cherche un élément sous une racine et échoue avec un message clair s'il manque. À préférer
 * au « ! » de TypeScript, qui promet sans vérifier et fait planter le module plus loin, sans
 * dire pourquoi.
 */
export function element<T extends Element = HTMLElement>(racine: ParentNode, selecteur: string): T {
	const trouve = racine.querySelector<T>(selecteur);
	if (!trouve) throw new Error(`Module incomplet : aucun élément « ${selecteur} ».`);
	return trouve;
}
