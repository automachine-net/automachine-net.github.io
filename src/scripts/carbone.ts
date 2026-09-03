// Calcul de l'ordre de grandeur des émissions d'une machine spéciale.
//
// Principes, tirés des décisions du projet :
// - le résultat est une fourchette, jamais un chiffre unique ;
// - la fourchette vient des incertitudes officielles des facteurs, pas d'une marge inventée ;
// - un poste sans facteur applicable n'est pas estimé : il est déclaré non chiffré ;
// - toutes les hypothèses sont restituées avec le résultat.
//
// Une catégorie peut être renseignée « à la louche », sans détail. Dans ce cas, ses bornes
// sont celles du sous-matériau le moins émetteur et du plus émetteur : la fourchette est
// large, et elle se resserre dès qu'on détaille. C'est voulu — l'imprécision de la saisie
// doit se voir dans le résultat, pas se cacher derrière une moyenne.

import facteurs from '../../content/donnees/facteurs-carbone.json';

export interface Entrees {
	/** Masse de chaque catégorie, en kilogrammes. */
	categories: Record<string, number>;
	/** Détail éventuel d'une catégorie : masse en kilogrammes par sous-matériau. */
	details: Record<string, Record<string, number>>;
	/** Puissance installée, en kilowatts. */
	puissance: number;
	/** Taux de charge moyen, entre 0 et 1. */
	tauxDeCharge: number;
	/** Heures de fonctionnement par an. */
	heuresParAn: number;
	/** Durée de vie attendue, en années. */
	dureeDeVie: number;
	/** Distance de livraison, en kilomètres. */
	distanceLivraison: number;
}

export interface Poste {
	cle: string;
	libelle: string;
	bas: number | null;
	haut: number | null;
}

export interface Resultat {
	postes: Poste[];
	totalBas: number;
	totalHaut: number;
	masseTotale: number;
	/** Équivalent en kilomètres parcourus en voiture, pour donner un ordre de grandeur. */
	kmVoitureBas: number;
	kmVoitureHaut: number;
	hypotheses: string[];
}

/**
 * Bornes d'un facteur, à partir de son incertitude officielle.
 *
 * L'incertitude est appliquée en rapport et non en écart : borne basse = valeur ÷ (1 + i),
 * borne haute = valeur × (1 + i). Une soustraction directe ramènerait à zéro tout facteur
 * porteur d'une incertitude de 100 %, et l'un de nos facteurs est dans ce cas. Or un
 * matériau présent dans la machine n'émet jamais zéro.
 *
 * Ce choix est le nôtre, pas une règle de l'ADEME. Il est affiché avec le résultat.
 */
function bornes(valeur: number, incertitudePct: number) {
	const rapport = 1 + incertitudePct / 100;
	return { bas: valeur / rapport, haut: valeur * rapport };
}

/** Bornes d'une catégorie renseignée sans détail : du moins au plus émetteur. */
function bornesCategorie(cle: string) {
	const categorie = facteurs.categories.find((c) => c.cle === cle)!;
	const toutes = categorie.sous.map((s) => bornes(s.valeur, s.incertitude_pct));
	return {
		bas: Math.min(...toutes.map((b) => b.bas)),
		haut: Math.max(...toutes.map((b) => b.haut)),
	};
}

export function calculer(e: Entrees): Resultat {
	const hypotheses: string[] = [];
	let fabricationBas = 0;
	let fabricationHaut = 0;
	let masseTotale = 0;

	for (const categorie of facteurs.categories) {
		const detail = e.details[categorie.cle];
		const detaillee = detail && Object.values(detail).some((v) => v > 0);

		if (detaillee) {
			const morceaux: string[] = [];
			for (const sous of categorie.sous) {
				const kg = detail![sous.cle] ?? 0;
				if (kg <= 0) continue;
				const b = bornes(sous.valeur, sous.incertitude_pct);
				fabricationBas += (kg / 1000) * b.bas;
				fabricationHaut += (kg / 1000) * b.haut;
				masseTotale += kg;
				morceaux.push(
					`${sous.libelle} ${kg} kg à ${sous.valeur.toLocaleString('fr-FR')} kgCO2e/tonne ± ${sous.incertitude_pct} %` +
						(sous.approche ? ' (facteur approché)' : '')
				);
			}
			if (morceaux.length) hypotheses.push(`${categorie.libelle} détaillés — ${morceaux.join(' ; ')}.`);
		} else {
			const kg = e.categories[categorie.cle] ?? 0;
			if (kg <= 0) continue;
			const b = bornesCategorie(categorie.cle);
			fabricationBas += (kg / 1000) * b.bas;
			fabricationHaut += (kg / 1000) * b.haut;
			masseTotale += kg;
			hypotheses.push(
				`${categorie.libelle} : ${kg} kg sans détail, donc bornés par le sous-matériau le moins émetteur et le plus émetteur de la catégorie, soit ${Math.round(b.bas).toLocaleString('fr-FR')} à ${Math.round(b.haut).toLocaleString('fr-FR')} kgCO2e/tonne. Détailler cette catégorie resserrerait la fourchette.`
			);
		}
	}

	// ---------------------------------------------------------------- Transport
	const t = bornes(facteurs.transport.valeur, facteurs.transport.incertitude_pct);
	const tonnes = masseTotale / 1000;
	const transportBas = tonnes * e.distanceLivraison * t.bas;
	const transportHaut = tonnes * e.distanceLivraison * t.haut;

	// ---------------------------------------------------------------- Usage
	const kWh = e.puissance * e.tauxDeCharge * e.heuresParAn * e.dureeDeVie;
	const el = bornes(facteurs.energie.valeur, facteurs.energie.incertitude_pct);
	const usageBas = kWh * el.bas;
	const usageHaut = kWh * el.haut;

	hypotheses.push(
		`Masse totale retenue : ${masseTotale.toLocaleString('fr-FR')} kg.`,
		`Matériaux considérés neufs, sans part recyclée.`,
		`Livraison sur ${e.distanceLivraison.toLocaleString('fr-FR')} km par ensemble routier de 40 à 44 tonnes ; l'acheminement des matières premières n'est pas compté.`,
		`Consommation calculée sur ${Math.round(e.tauxDeCharge * 100)} % de ${e.puissance} kW installés, soit ${Math.round(kWh).toLocaleString('fr-FR')} kWh sur ${e.dureeDeVie} ans.`,
		`Électricité au mix moyen français de 2024 : ${facteurs.energie.valeur} kgCO2e/kWh. Usage en France continentale uniquement.`,
		`Fourchette obtenue en appliquant à chaque facteur son incertitude officielle publiée par l'ADEME, en rapport : borne basse = valeur ÷ (1 + incertitude), borne haute = valeur × (1 + incertitude). Ce mode d'application est un choix d'Automachine, pas une règle de l'ADEME.`
	);

	const totalBas = fabricationBas + transportBas + usageBas;
	const totalHaut = fabricationHaut + transportHaut + usageHaut;

	return {
		postes: [
			{ cle: 'fabrication', libelle: 'Fabrication', bas: fabricationBas, haut: fabricationHaut },
			{ cle: 'transport', libelle: 'Transport', bas: transportBas, haut: transportHaut },
			{ cle: 'usage', libelle: 'Usage', bas: usageBas, haut: usageHaut },
			{ cle: 'fin-de-vie', libelle: 'Fin de vie', bas: null, haut: null },
		],
		totalBas,
		totalHaut,
		masseTotale,
		kmVoitureBas: totalBas / facteurs.comparaison.valeur,
		kmVoitureHaut: totalHaut / facteurs.comparaison.valeur,
		hypotheses,
	};
}

/** Met en forme une masse de CO2e : en kg jusqu'à une tonne, en tonnes au-delà. */
export function formaterCO2e(kg: number): string {
	if (kg >= 1000) {
		return `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: kg >= 10000 ? 0 : 1 })} tCO2e`;
	}
	return `${Math.round(kg).toLocaleString('fr-FR')} kgCO2e`;
}

/** Arrondit un grand nombre pour une comparaison parlante : 12 800 → « 13 000 ». */
export function arrondiParlant(n: number): string {
	if (n >= 100000) return `${Math.round(n / 10000) * 10}` + ' 000';
	if (n >= 10000) return (Math.round(n / 1000) * 1000).toLocaleString('fr-FR');
	if (n >= 1000) return (Math.round(n / 100) * 100).toLocaleString('fr-FR');
	return `${Math.round(n / 10) * 10}`;
}
