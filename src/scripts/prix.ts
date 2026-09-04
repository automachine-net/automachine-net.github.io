// Estimation d'un ordre de prix pour une machine spéciale.
//
// Modèle additif : un socle selon la nature du projet, puis un montant par élément déclaré
// (axes, robots, contrôle, sécurité, encombrement, logiciel, prestations). Chaque montant se
// décompose en matériel, études et réalisation ; la gestion de projet est un pourcentage des
// deux derniers. La nature du projet dit quelles composantes comptent : une étude seule ne
// facture ni matériel ni réalisation.
//
// Des facteurs d'exigence (cadence, précisions) majorent les postes qu'ils concernent. Une
// règle de la maison relève ensuite le travail au niveau du matériel s'il lui est inférieur :
// une machine se conçoit et se met au point, elle ne s'achète pas.
//
// Le résultat est une fourchette, jamais un chiffre unique : les valeurs du modèle sont des
// ordres de grandeur, et deux machines aux mêmes réponses peuvent différer du simple au
// double selon la solution technique. La largeur de la fourchette est asymétrique, parce que
// les dépassements sont plus fréquents que les économies.
//
// Les montants du fichier de données sont des prix de vente hors taxes : rien à ajouter.

export type Montants = { materiel: number; etudes: number; realisation: number };

export type Option = Montants & { cle: string; libelle: string; natures?: string[] };

export type Poste =
	| { cle: string; type: 'nombre'; libelle: string; unite: string; aide: string; louche: Montants; detail?: Option[] }
	| { cle: string; type: 'choix'; libelle: string; aide: string; options: Option[] }
	| { cle: string; type: 'cases'; libelle: string; aide: string; options: Option[] };

export interface Facteur {
	cle: string;
	libelle: string;
	aide: string;
	/** Clés des postes que ce facteur majore. */
	postes: string[];
	options: { cle: string; libelle: string; coefficient: number }[];
}

export interface Nature {
	cle: string;
	libelle: string;
	description: string;
	etudes: boolean;
	materiel: boolean;
	realisation: boolean;
	socle: Montants;
}

export interface Modele {
	avertissement: string;
	gestion_projet_pct: number;
	fourchette: { bas_pct: number; haut_pct: number };
	natures: Nature[];
	postes: Poste[];
	facteurs: Facteur[];
	regles: { main_doeuvre_minimum: string };
	parts: { cle: string; libelle: string }[];
}

export interface Entrees {
	nature: string;
	/** Postes « nombre » : un total à la louche, ou un détail par sous-type. */
	nombres: Record<string, number | Record<string, number>>;
	/** Postes « choix » : la clé de l'option retenue. */
	choix: Record<string, string>;
	/** Postes « cases » : les clés cochées. */
	cases: Record<string, string[]>;
	/** Facteurs d'exigence : la clé de l'option retenue. */
	facteurs: Record<string, string>;
}

export interface Resultat {
	/** Prix hors taxes au milieu de la fourchette. */
	prix: number;
	bas: number;
	haut: number;
	/** Répartition du prix par nature de dépense, dans l'ordre du modèle. */
	parts: { cle: string; libelle: string; montant: number }[];
	/** Ce qui a été retenu, en clair, pour que le visiteur relise ses réponses. */
	hypotheses: string[];
	/** Vrai si rien n'a été déclaré au-delà du socle. */
	vide: boolean;
}

const zero = (): Montants => ({ materiel: 0, etudes: 0, realisation: 0 });

function ajouter(cible: Montants, m: Montants, fois = 1): void {
	cible.materiel += m.materiel * fois;
	cible.etudes += m.etudes * fois;
	cible.realisation += m.realisation * fois;
}

/** Première lettre en minuscule, le reste intact : « 400 W » reste « 400 W ». */
const initiale = (s: string) => s.replace(/^./, (c) => c.toLowerCase());

/** Arrondi à un pas parlant : 1 000 € en dessous de 50 000, puis 5 000, puis 10 000. */
export function arrondir(v: number): number {
	const pas = v < 50000 ? 1000 : v < 200000 ? 5000 : 10000;
	return Math.round(v / pas) * pas;
}

export function formaterEuros(v: number): string {
	return `${arrondir(v).toLocaleString('fr-FR')} €`;
}

export function estimer(modele: Modele, e: Entrees): Resultat {
	const nature = modele.natures.find((n) => n.cle === e.nature) ?? modele.natures[0];
	const hypotheses: string[] = [nature.libelle];
	let vide = true;

	// Un cumul par poste, pour que les facteurs puissent majorer chacun séparément.
	const parPoste: Record<string, Montants> = {};
	const cumul = (cle: string) => (parPoste[cle] ??= zero());

	for (const p of modele.postes) {
		if (p.type === 'nombre') {
			const v = e.nombres[p.cle];
			if (typeof v === 'number') {
				if (v > 0) {
					ajouter(cumul(p.cle), p.louche, v);
					hypotheses.push(`${v} ${initiale(p.libelle)}`);
					vide = false;
				}
			} else if (v && p.detail) {
				const morceaux: string[] = [];
				for (const d of p.detail) {
					const n = v[d.cle] ?? 0;
					if (n > 0) {
						ajouter(cumul(p.cle), d, n);
						morceaux.push(`${n} ${initiale(d.libelle)}`);
					}
				}
				if (morceaux.length) {
					hypotheses.push(`${p.libelle} : ${morceaux.join(' ; ')}`);
					vide = false;
				}
			}
		} else if (p.type === 'choix') {
			const o = p.options.find((x) => x.cle === e.choix[p.cle]) ?? p.options[0];
			ajouter(cumul(p.cle), o);
			if (o.materiel + o.etudes + o.realisation > 0) {
				hypotheses.push(`${p.libelle} : ${initiale(o.libelle)}`);
				vide = false;
			}
		} else {
			const cochees = e.cases[p.cle] ?? [];
			const retenues = p.options.filter(
				(o) => cochees.includes(o.cle) && (!o.natures || o.natures.includes(nature.cle))
			);
			for (const o of retenues) ajouter(cumul(p.cle), o);
			if (retenues.length) {
				hypotheses.push(`${p.libelle} : ${retenues.map((o) => initiale(o.libelle)).join(' ; ')}`);
				vide = false;
			}
		}
	}

	// Les facteurs d'exigence majorent les postes qu'ils concernent.
	for (const f of modele.facteurs) {
		const o = f.options.find((x) => x.cle === e.facteurs[f.cle]) ?? f.options[0];
		if (o.coefficient === 1) continue;
		for (const cle of f.postes) {
			const m = parPoste[cle];
			if (!m) continue;
			m.materiel *= o.coefficient;
			m.etudes *= o.coefficient;
			m.realisation *= o.coefficient;
		}
		hypotheses.push(`${f.libelle} : ${initiale(o.libelle)}`);
	}

	const total = zero();
	ajouter(total, nature.socle);
	for (const m of Object.values(parPoste)) ajouter(total, m);

	// La nature du projet décide de ce qui compte.
	const materiel = nature.materiel ? total.materiel : 0;
	let etudes = nature.etudes ? total.etudes : 0;
	let realisation = nature.realisation ? total.realisation : 0;
	let gestion = ((etudes + realisation) * modele.gestion_projet_pct) / 100;

	// Règle de la maison : le travail ne pèse jamais moins que le matériel. Les trois postes
	// de travail sont relevés dans la même proportion.
	const travail = etudes + realisation + gestion;
	if (materiel > 0 && travail > 0 && travail < materiel) {
		const k = materiel / travail;
		etudes *= k;
		realisation *= k;
		gestion *= k;
		hypotheses.push(modele.regles.main_doeuvre_minimum);
	}

	const prix = materiel + etudes + realisation + gestion;
	const montants: Record<string, number> = { materiel, etudes, realisation, gestion };
	return {
		prix,
		bas: prix * (1 + modele.fourchette.bas_pct / 100),
		haut: prix * (1 + modele.fourchette.haut_pct / 100),
		parts: modele.parts.map((p) => ({ cle: p.cle, libelle: p.libelle, montant: montants[p.cle] ?? 0 })),
		hypotheses,
		vide,
	};
}
