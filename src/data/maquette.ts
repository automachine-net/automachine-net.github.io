// Données partagées par les maquettes du lot 1.
// Tout texte non rédigé est marqué [À RÉDIGER]. Aucun chiffre inventé.
// Les types de machines viennent des dossiers de photos fournis (noms de machines, pas de clients).

// « Secteurs » retiré du menu et de l'arborescence le 2026-09-02 : pas assez de matière pour
// une page dédiée. Les secteurs sont annoncés dans l'introduction de l'accueil, rappelés par
// des pictogrammes, et repris à l'intérieur des pages Entreprise et Machines.
export const navigation = [
	{ label: 'Entreprise', href: '/entreprise' },
	{ label: 'Machines', href: '/machines' },
	{ label: 'Outils', href: '/outils/quiz-reglement-machines' },
	{ label: 'Contact', href: '/contact' },
];

export const machines = [
	{ slug: 'bobineuse', nom: 'Bobineuse', secteur: 'Recherche', fonction: '[À RÉDIGER]' },
	{
		slug: 'banc-de-test-hydraulique',
		nom: 'Banc de test hydraulique',
		secteur: 'Bancs de test',
		fonction: '[À RÉDIGER]',
	},
	{ slug: 'machine-a-plisser', nom: 'Machine à plisser', secteur: 'Industrie', fonction: '[À RÉDIGER]' },
	{ slug: 'cabine-robotisee', nom: 'Cabine robotisée', secteur: 'Industrie', fonction: '[À RÉDIGER]' },
	{ slug: 'depacking', nom: 'Ligne de dépacking', secteur: 'Industrie', fonction: '[À RÉDIGER]' },
	{ slug: 'sableuse', nom: 'Sableuse', secteur: 'Recherche', fonction: '[À RÉDIGER]' },
];

export const secteurs = [
	{ slug: 'industrie', nom: 'Industrie' },
	{ slug: 'agriculture', nom: 'Agriculture' },
	{ slug: 'recherche', nom: 'Recherche' },
	{ slug: 'bancs-de-test', nom: 'Bancs de test' },
	{ slug: 'tertiaire', nom: 'Tertiaire et grand public' },
];

// Logos fournis par le dirigeant, dont il a confirmé le droit d'usage le 2026-09-02.
// Fichiers de 200 × 200 px, fond blanc, issus du dossier ressources.
export const clients = [
	{ nom: 'Airbus', logo: '/images/clients/airbus.png' },
	{ nom: 'SNCF', logo: '/images/clients/sncf.png' },
	{ nom: 'EDF', logo: '/images/clients/edf.png' },
	{ nom: 'CEA', logo: '/images/clients/cea.png' },
	{ nom: 'Faiveley Transport', logo: '/images/clients/faiveley-transport.png' },
	{ nom: 'Filtratech', logo: '/images/clients/filtratech.png' },
	{ nom: 'Yoteq', logo: '/images/clients/yoteq.png' },
];

// Conservé pour les maquettes A, B et C (premières propositions). La maquette finale
// n'utilise plus de bloc parapluie « Outils » : un bloc par outil, titré par ce qu'il fait.
export const outils = [
	{
		slug: 'quiz-reglement-machines',
		nom: 'Quiz règlement machines',
		accroche: 'Règlement (UE) 2023/1230 face à la directive 2006/42/CE : testez vos réflexes.',
		note: 'Contenu informatif, ne constitue pas un conseil juridique.',
	},
	{
		slug: 'reversibilite',
		nom: 'Le principe de réversibilité',
		accroche: 'Une explication interactive, à manipuler.',
		note: '[À RÉDIGER]',
	},
];

export const chiffres = [
	{ valeur: '2011', legende: 'création de Sourcitem' },
	{ valeur: '2017', legende: 'Sourcitem devient Automachine' },
	{ valeur: '[À RÉDIGER]', legende: 'machines livrées' },
	{ valeur: '[À RÉDIGER]', legende: 'personnes dans l’équipe' },
];

// Date d'application du règlement (UE) 2023/1230.
export const dateReglement = '2027-01-20';
