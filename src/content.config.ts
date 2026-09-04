// Déclaration des collections de contenu.
//
// Le contenu vit dans le dossier `content/` à la racine du dépôt, en Markdown et JSON,
// pour rester éditable avec un simple éditeur de texte si tous les outils disparaissent.
//
// Ces schémas servent de garde-fou : si un champ obligatoire manque ou si un type de bloc
// est mal orthographié, la construction échoue avec un message clair au lieu de publier
// une page cassée.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const fond = z.enum(['blanc', 'clair', 'sombre']).optional();

const bloc = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('hero'),
		surtitre: z.string().optional(),
		titre: z.string(),
		chapeau: z.string().optional(),
		lien_libelle: z.string().optional(),
		lien_url: z.string().optional(),
		lien_secondaire_libelle: z.string().optional(),
		lien_secondaire_url: z.string().optional(),
		afficher_secteurs: z.boolean().optional(),
		titre_principal: z.boolean().optional(),
	}),
	z.object({
		type: z.literal('texte'),
		titre: z.string().optional(),
		texte: z.string(),
		fond,
	}),
	z.object({
		type: z.literal('texte-image'),
		titre: z.string().optional(),
		texte: z.string(),
		image: z.string().optional(),
		image_alt: z.string().optional(),
		image_attente: z.string().optional(),
		position_image: z.enum(['gauche', 'droite']).optional(),
		lien_libelle: z.string().optional(),
		lien_url: z.string().optional(),
		fond,
	}),
	z.object({
		type: z.literal('galerie'),
		titre: z.string().optional(),
		images: z.array(
			z.object({
				image: z.string().optional(),
				alt: z.string().optional(),
				legende: z.string().optional(),
				attente: z.string().optional(),
			})
		),
		colonnes: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
		fond,
	}),
	z.object({
		type: z.literal('chiffres'),
		titre: z.string().optional(),
		chiffres: z.array(z.object({ valeur: z.string(), legende: z.string() })),
		fond,
	}),
	z.object({
		type: z.literal('fiche-machine'),
		titre: z.string().optional(),
		introduction: z.string().optional(),
		machines: z.array(z.string()).optional(),
		lien_libelle: z.string().optional(),
		lien_url: z.string().optional(),
		bouton_libelle: z.string().optional(),
		bouton_url: z.string().optional(),
		bouton_texte: z.string().optional(),
		fond,
	}),
	z.object({
		type: z.literal('visionneuse-3d'),
		titre: z.string().optional(),
		modele: z.string(),
		legende: z.string().optional(),
		fond,
	}),
	z.object({
		type: z.literal('citation'),
		citation: z.string(),
		auteur: z.string().optional(),
		fonction: z.string().optional(),
		fond,
	}),
	z.object({
		type: z.literal('appel'),
		titre: z.string(),
		texte: z.string().optional(),
		lien_libelle: z.string(),
		lien_url: z.string(),
		fond,
	}),
	z.object({
		type: z.literal('faq'),
		titre: z.string().optional(),
		questions: z.array(z.object({ question: z.string(), reponse: z.string() })),
		fond,
	}),
	z.object({
		type: z.literal('module'),
		titre: z.string().optional(),
		introduction: z.string().optional(),
		module: z.enum([
			'quiz-extrait',
			'quiz-complet',
			'compte-a-rebours',
			'apercu-carbone',
			'simulateur-carbone',
			'estimateur-prix',
			'flux-matieres',
			'reversibilite',
			'a-venir',
		]),
		nombre_questions: z.number().optional(),
		lien_libelle: z.string().optional(),
		lien_url: z.string().optional(),
		attente: z.string().optional(),
		fond,
	}),
	z.object({
		type: z.literal('clients'),
		titre: z.string().optional(),
		fond,
	}),
]);

const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/pages' }),
	schema: z.object({
		/** Nom de la page dans l'interface d'édition. N'apparaît pas sur le site. */
		libelle: z.string(),
		titre: z.string(),
		description: z.string(),
		/** Retire la page des moteurs de recherche (module non public, page en chantier). */
		noindex: z.boolean().optional(),
		blocs: z.array(bloc).default([]),
	}),
});

const machines = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/machines' }),
	schema: z.object({
		nom: z.string(),
		/** Ordre d'affichage, du plus petit au plus grand. */
		ordre: z.number(),
		secteur: z.string(),
		/** Une phrase : ce que fait la machine. */
		resume: z.string(),
		description: z.string(),
		/** Nom du client, uniquement avec son accord écrit. Sinon, laisser vide. */
		client: z.string().optional(),
		/** Animation en boucle de la machine (.mp4), téléversée depuis le CMS dans /videos. */
		video: z.string().optional(),
		/** Image affichée avant le démarrage de l'animation. */
		video_affiche: z.string().optional(),
		/** Chemin du modèle glTF binaire (.glb), téléversé depuis le CMS dans /modeles. */
		fichier_3d: z.string().optional(),
		/** Volume d'attente (dessin filaire), tant qu'il n'y a pas de fichier 3D. */
		modele_3d: z.string().optional(),
		/** Lignes de la fiche technique : libellé et valeur. */
		caracteristiques: z.array(z.object({ libelle: z.string(), valeur: z.string() })).default([]),
		image: z.string().optional(),
		image_alt: z.string().optional(),
		blocs: z.array(bloc).default([]),
	}),
});

export const collections = { pages, machines };
