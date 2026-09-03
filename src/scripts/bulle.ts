// Recalage des infobulles pour qu'elles restent dans la page.
//
// Une bulle centrée sous son déclencheur sort de l'écran dès que celui-ci est près d'un
// bord. Le CSS seul ne sait pas le corriger : il faut mesurer. Cette fonction pose une
// variable « --decalage » que la bulle applique dans sa translation.
//
// Chaque bulle doit être placée dans un élément marqué `data-bulle`, avec la classe
// `.bulle` ou l'attribut `data-bulle-cible`.

const MARGE = 8;

/** Décalage horizontal à appliquer pour que la bulle tienne dans la fenêtre. */
function decalage(bulle: HTMLElement): number {
	bulle.style.setProperty('--decalage', '0px');
	const r = bulle.getBoundingClientRect();
	if (r.left < MARGE) return Math.round(MARGE - r.left);
	if (r.right > innerWidth - MARGE) return Math.round(innerWidth - MARGE - r.right);
	return 0;
}

/**
 * Surveille les déclencheurs d'infobulle d'une racine donnée et recale leur bulle à
 * l'ouverture. À appeler une fois par page qui en contient.
 */
export function recalerLesBulles(racine: ParentNode = document): void {
	racine.querySelectorAll<HTMLElement>('[data-bulle]').forEach((declencheur) => {
		const bulle =
			declencheur.querySelector<HTMLElement>('[data-bulle-cible]') ??
			declencheur.querySelector<HTMLElement>('.bulle') ??
			declencheur.querySelector<HTMLElement>('[class*="bulle"]');
		if (!bulle) return;
		const recaler = () => bulle.style.setProperty('--decalage', `${decalage(bulle)}px`);
		declencheur.addEventListener('mouseenter', recaler);
		declencheur.addEventListener('focusin', recaler);
	});
}
