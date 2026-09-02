// Données partagées par les maquettes du lot 1.
// Tout texte non rédigé est marqué [À RÉDIGER]. Aucun chiffre inventé.
// Les types de machines viennent des dossiers de photos fournis (noms de machines, pas de clients).

export const navigation = [
	{ label: 'Entreprise', href: '/entreprise' },
	{ label: 'Machines', href: '/machines' },
	{ label: 'Secteurs', href: '/secteurs' },
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

// Logos présents dans le dossier ressources fourni par le dirigeant.
// Aucun logo n'est publié tant que l'accord d'usage de la marque n'est pas confirmé :
// la maquette affiche des cadres à la bonne taille portant le nom en texte.
export const clients = [
	{ nom: 'Airbus', logo: null },
	{ nom: 'SNCF', logo: null },
	{ nom: 'EDF', logo: null },
	{ nom: 'CEA', logo: null },
	{ nom: 'Siemens', logo: null },
	{ nom: 'Faiveley Transport', logo: null },
	{ nom: 'YOTEQ', logo: null },
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
