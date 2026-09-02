// Conversion du Markdown saisi dans le CMS en HTML.
//
// Dépendance : « marked ». Elle transforme le Markdown des champs de texte en HTML au moment
// de la construction du site ; aucune ligne n'est envoyée au navigateur.
//
// Choix assumé : ne pas utiliser le moteur Markdown interne d'Astro. Il fonctionne, mais c'est
// une dépendance interne dont le nom change d'une version à l'autre. « marked » a une interface
// stable depuis des années : le projet doit pouvoir être repris dans cinq ans.
//
// Le contenu vient d'éditeurs identifiés (comptes GitHub nominatifs de l'organisation) :
// le HTML écrit à la main dans le Markdown est donc conservé tel quel.
import { marked as markedLib } from 'marked';

markedLib.setOptions({
	// Un simple retour à la ligne ne coupe pas le paragraphe : un texte écrit sur plusieurs
	// lignes dans le fichier reste un seul paragraphe à l'écran. Pour changer de paragraphe,
	// on laisse une ligne vide, ce que l'éditeur du CMS fait tout seul.
	breaks: false,
	gfm: true,
});

/** Rend un texte Markdown complet (paragraphes, listes, titres, liens). */
export function marked(texte: string | undefined | null): string {
	if (!texte) return '';
	return markedLib.parse(texte, { async: false }) as string;
}

/** Rend un texte court sans l'envelopper dans un paragraphe (titres, légendes). */
export function markedEnLigne(texte: string | undefined | null): string {
	if (!texte) return '';
	return markedLib.parseInline(texte, { async: false }) as string;
}
