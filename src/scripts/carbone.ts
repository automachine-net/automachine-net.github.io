// Calcul de l'ordre de grandeur des émissions d'une machine spéciale.
//
// Principes, tirés des décisions du projet :
// - le résultat est une fourchette, jamais un chiffre unique ;
// - la fourchette vient des incertitudes officielles des facteurs, pas d'une marge inventée ;
// - un poste sans facteur applicable n'est pas estimé : il est déclaré non chiffré ;
// - toutes les hypothèses sont restituées avec le résultat.

import facteurs from '../../content/donnees/facteurs-carbone.json';

export interface Entrees {
	/** Masse totale de la machine, en kilogrammes. */
	masse: number;
	/** Répartition en pourcentage, par famille de matériaux. Le total doit faire 100. */
	repartition: Record<string, number>;
	/** Puissance installée, en kilowatts. */
	puissance: number;
	/** Heures de fonctionnement par an. */
	heuresParAn: number;
	/** Durée de vie attendue, en années. */
	dureeDeVie: number;
	/** Distance de livraison, en kilomètres. */
	distanceLivraison: number;
	/** Taux de charge moyen : part de la puissance installée réellement appelée. */
	tauxDeCharge: number;
}

export interface Poste {
	cle: string;
	libelle: string;
	bas: number | null;
	haut: number | null;
	/** Explication affichée avec le résultat. */
	detail: string;
}

export interface Resultat {
	postes: Poste[];
	totalBas: number;
	totalHaut: number;
	/** Postes laissés hors du total, faute de facteur applicable. */
	nonChiffres: string[];
	hypotheses: string[];
}

/**
 * Bornes d'un facteur, à partir de son incertitude officielle.
 *
 * L'incertitude est appliquée en rapport et non en écart : borne basse = valeur ÷ (1 + i),
 * borne haute = valeur × (1 + i). Une soustraction directe ramènerait à zéro tout facteur
 * porteur d'une incertitude de 100 %, et deux de nos facteurs sont dans ce cas. Or un
 * matériau présent dans la machine n'émet jamais zéro : une borne basse nulle serait fausse,
 * et rendrait la fourchette inutilisable.
 *
 * Ce choix est le nôtre, pas une règle de l'ADEME. Il est affiché avec le résultat et fait
 * partie de ce qui reste à valider.
 */
function bornes(valeur: number, incertitudePct: number, valeurHaute?: number) {
	const rapport = 1 + incertitudePct / 100;
	return {
		bas: valeur / rapport,
		haut: (valeurHaute ?? valeur) * rapport,
	};
}

export function calculer(e: Entrees): Resultat {
	const masseTonnes = e.masse / 1000;
	const hypotheses: string[] = [];

	// ---------------------------------------------------------------- Fabrication
	let fabricationBas = 0;
	let fabricationHaut = 0;
	const detailsMateriaux: string[] = [];

	for (const materiau of facteurs.materiaux) {
		const part = (e.repartition[materiau.cle] ?? 0) / 100;
		if (part <= 0) continue;
		const tonnes = masseTonnes * part;
		const b = bornes(materiau.valeur, materiau.incertitude_pct, materiau.valeur_haute);
		fabricationBas += tonnes * b.bas;
		fabricationHaut += tonnes * b.haut;
		detailsMateriaux.push(
			`${materiau.libelle} ${Math.round(part * 100)} % : ${materiau.valeur}${
				materiau.valeur_haute ? ` à ${materiau.valeur_haute}` : ''
			} kgCO2e/tonne, incertitude ${materiau.incertitude_pct} %` +
				(materiau.approximation ? ' (approximation)' : '')
		);
	}

	// ---------------------------------------------------------------- Transport
	const t = bornes(facteurs.transport.valeur, facteurs.transport.incertitude_pct);
	const transportBas = masseTonnes * e.distanceLivraison * t.bas;
	const transportHaut = masseTonnes * e.distanceLivraison * t.haut;

	// ---------------------------------------------------------------- Usage
	const kWh = e.puissance * e.tauxDeCharge * e.heuresParAn * e.dureeDeVie;
	const el = bornes(facteurs.energie.valeur, facteurs.energie.incertitude_pct);
	const usageBas = kWh * el.bas;
	const usageHaut = kWh * el.haut;

	// ---------------------------------------------------------------- Hypothèses
	hypotheses.push(
		`Masse de ${e.masse.toLocaleString('fr-FR')} kg répartie ainsi — ${detailsMateriaux.join(' ; ')}.`,
		`Matériaux considérés neufs, sans part recyclée.`,
		`Livraison sur ${e.distanceLivraison.toLocaleString('fr-FR')} km par ensemble routier de 40 à 44 tonnes ; l'acheminement des matières premières n'est pas compté.`,
		`Consommation calculée sur ${Math.round(e.tauxDeCharge * 100)} % de la puissance installée, soit ${kWh.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} kWh sur ${e.dureeDeVie} ans.`,
		`Électricité au mix moyen français de 2024 : ${facteurs.energie.valeur} kgCO2e/kWh. Usage en France continentale uniquement.`,
		`Fourchette obtenue en appliquant à chaque facteur son incertitude officielle publiée par l'ADEME, en rapport : borne basse = valeur ÷ (1 + incertitude), borne haute = valeur × (1 + incertitude). Ce mode d'application est un choix d'Automachine, pas une règle de l'ADEME.`
	);

	const postes: Poste[] = [
		{
			cle: 'fabrication',
			libelle: 'Fabrication',
			bas: fabricationBas,
			haut: fabricationHaut,
			detail: 'Production des matériaux constitutifs de la machine.',
		},
		{
			cle: 'transport',
			libelle: 'Transport',
			bas: transportBas,
			haut: transportHaut,
			detail: 'Livraison de la machine terminée jusqu’au site du client.',
		},
		{
			cle: 'usage',
			libelle: 'Usage',
			bas: usageBas,
			haut: usageHaut,
			detail: 'Électricité consommée pendant toute la durée de vie.',
		},
		{
			cle: 'fin-de-vie',
			libelle: 'Fin de vie',
			bas: null,
			haut: null,
			detail: facteurs.fin_de_vie.remarque,
		},
	];

	return {
		postes,
		totalBas: fabricationBas + transportBas + usageBas,
		totalHaut: fabricationHaut + transportHaut + usageHaut,
		nonChiffres: ['Fin de vie'],
		hypotheses,
	};
}

/** Met en forme une masse de CO2e : en kg jusqu'à une tonne, en tonnes au-delà. */
export function formaterCO2e(kg: number): string {
	if (kg >= 1000) {
		return `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: kg >= 10000 ? 0 : 1 })} tCO2e`;
	}
	return `${kg.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} kgCO2e`;
}
