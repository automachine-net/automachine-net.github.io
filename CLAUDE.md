# Automachine — site automachine.net

Refonte complète du site d'Automachine (PME française, conception et fabrication de machines
spéciales ; fondée en 2011 sous le nom Sourcitem, renommée Automachine en 2017).
Ce fichier condense les décisions prises par le dirigeant. Elles ne se rediscutent pas.

## Règles de travail

- Communication en français. L'interlocuteur ne connaît ni Git, ni GitHub, ni le développement web.
- Toute commande qu'on lui demande d'exécuter : expliquée en une phrase, donnée une à la fois,
  résultat vérifié avant la suivante.
- Point non tranché : poser la question avant d'implémenter.
- Jamais de supposition présentée comme un fait (versions, chemins d'interface, tarifs, API) :
  on vérifie.
- Travail par lots : plan court → validation → exécution → commits atomiques en français →
  démonstration sur l'URL provisoire. Pas de lot suivant sans validation du précédent.
- Dépendances : le minimum, chaque bibliothèque justifiée en une phrase.
- Documentation en français, rédigée au fil de l'eau (voir `docs/`).

## Architecture

- Astro, sortie HTML statique. Îlots React uniquement pour les modules interactifs.
- Contenu en Markdown et JSON versionnés dans Git. Principe fondamental : sans aucun outil,
  le site reste éditable avec un éditeur de texte.
- Édition : Sveltia CMS, backend GitHub. 2 à 4 éditeurs, comptes GitHub gratuits et nominatifs,
  dans une organisation GitHub privée (`automachine-net`). Jamais de compte partagé.
  Relais OAuth GitHub en PHP sur l'hébergement mutualisé. Aucun service tiers (ni Netlify,
  ni Cloudflare Worker).
- Hébergement : Infomaniak « Hébergement Web » mutualisé (HTML, CSS, JS, PHP, Python, MySQL).
  Pas de Node.js serveur. Dynamique = côté client ou script PHP minimal.
- Déploiement : GitHub Actions construit à chaque modification et pousse sur Infomaniak
  (rsync via SSH). Aucune étape manuelle.
- Formulaire de contact : script PHP, SMTP authentifié via un compte mail Infomaniak dédié
  (`site@` ou `noreply@`), jamais Microsoft 365. Destinataires dans un JSON éditable dans le CMS.
  Anti-spam : champ piège + limitation de fréquence, pas de captcha externe. Aucun stockage.
  L'adresse d'envoi Infomaniak devra être ajoutée au SPF du domaine le jour de la bascule
  (noté dans `docs/DEPLOIEMENT.md`).
- Statistiques : Matomo auto-hébergé sur le même hébergement, configuration sans cookie
  (exemption de consentement CNIL, pas de bandeau). Rapport mensuel par mail aux adresses du
  même JSON de destinataires.
- Langue : français uniquement. Rien à prévoir pour l'anglais.
- Aucun service tiers côté client : polices auto-hébergées, pas de GTM/GA, pas de captcha
  externe, pas de CDN tiers. Matomo est le seul script de mesure, servi depuis notre domaine.
- Migration domaine/DNS : hors périmètre. Ne rien toucher à `automachine.net`, EX2,
  Mailinblack, Microsoft 365. On prépare seulement le `.htaccess` de redirections 301 et
  `docs/BASCULE.md`.

## Identité visuelle

- Logo : SVG fournis (avec/sans texte, clair/sombre), utilisés tels quels. Variante aplatie
  sans dégradé pour les petits favicons.
- Palette :
  - `#53769A` bleu profond — fonds et surfaces principales (peut être assombri).
  - `#7AABD6` bleu clair — aplats, graphiques, décor. Jamais en texte sur blanc (2,44:1).
  - `#F79F22` orange — accent unique et rare. Jamais en texte sur blanc (2,11:1).
  - `#56514F` gris — texte courant (7,82:1 sur blanc).
  - Blanc. Le violet `#3C005A` de l'ancienne charte est abandonné.
  - WCAG AA obligatoire (4,5:1 texte courant, 3:1 grands titres), vérifié par calcul.
- Typographies : League Spartan (titres), IBM Plex Sans (texte). woff2 auto-hébergés,
  sous-ensembles latin étendu.
- Direction : le site comme démonstration technique. Sobre, haut de gamme, fond clair dominant,
  interactif (on manipule plutôt qu'on regarde). Références : ciechanowski.me,
  learningmusic.ableton.com, press.stripe.com. Anti-références : illustrations vectorielles
  génériques, esthétique start-up sur fond noir, animations décoratives sans fonction.
- Images : pas de photo pro possible. Rendus 3D depuis la CAO, modèles 3D manipulables,
  animations de cinématique exportées de la CAO à la place de la vidéo.

## Contenu et structure

- Arborescence : `/`, `/entreprise`, `/machines` (5–6 réalisations, page unique déroulante,
  grandes images pleine largeur, ni grille ni filtres), `/machines/[slug]` (fiche + visionneuse
  3D ; nom du client seulement avec accord écrit, sinon secteur), `/secteurs` (par domaine
  d'activité, pas par client), `/outils/quiz-reglement-machines`, `/outils/simulateur-carbone`,
  `/outils/reversibilite`, `/contact`, `/mentions-legales`, `/confidentialite`.
- Pages composées de blocs prédéfinis éditables dans le CMS : hero, texte, texte + image,
  galerie, chiffres clés, fiche machine, visionneuse 3D, citation, appel à l'action, FAQ,
  module. Critère : créer une page complète depuis le CMS sans développeur.
- Textes : tout réécrit, rien repris de l'ancien site. Non rédigé = `[À RÉDIGER]`.
  Jamais de lorem ipsum, de texte inventé, de chiffre ou de client fictif.

## Modèles 3D

- Source Fusion 360 → nettoyage (visserie, internes) → export OBJ/FBX maillage modéré →
  Blender → glTF/GLB compressé (Draco ou meshopt). Chemins de menu vérifiés sur la version
  installée, jamais supposés.
- 2 à 5 Mo par machine, 10 Mo maximum absolu. Chargement différé, image d'attente, repli
  image fixe sans WebGL.
- `<model-viewer>` par défaut. three.js seulement si vue éclatée ou animation au défilement
  le justifie, expliqué avant.
- Rien de confidentiel dans les modèles publiés : pas de cotes, d'usinage, de marquage client.
- Une machine de bout en bout d'abord, test mobile réel, go / no-go avant les cinq autres.
  No-go = images fixes calculées depuis les mêmes modèles.
- Cinématiques animées dans Fusion, exportées en vidéo courte, intégrées en boucle muette.
  Procédure complète dans `docs/3D.md`.

## Modules interactifs

Chaque module : composant autonome, URL dédiée, image Open Graph propre, extrait d'intégration
via le bloc « module ». Aucune donnée personnelle collectée.

1. Quiz règlement machines. Parcours Pro : règlement (UE) 2023/1230 vs directive 2006/42/CE,
   64 questions fournies en CSV → JSON éditable dans le CMS, retour immédiat coloré au clic.
   Parcours Découverte : court, grand public, à rédiger ensemble. Compte à rebours vers le
   20 janvier 2027. Mention obligatoire : contenu informatif, pas un conseil juridique.
2. Simulateur d'empreinte carbone. V1 = squelette et méthode, non public (non indexé, non
   lié) tant que les ratios de calage ne sont pas fournis. Entrées grossières (masse,
   répartition matériaux, puissance, heures/an, durée de vie), France uniquement. Sortie en
   fourchette, jamais un chiffre unique, décomposition fabrication / transport / usage /
   fin de vie, hypothèses affichées. Facteurs : Base Empreinte (ADEME), PEP ecopassport,
   dans un JSON séparé sourcé ligne par ligne. Aucun qualificatif environnemental
   (« bas carbone », « vert », « neutre »…) : directive (UE) 2024/825 dès le 27/09/2026.
3. Animation réversibilité : module et emplacement prévus, scénario à construire ensemble.

## Qualité

- Lighthouse ≥ 90 sur les quatre axes, mobile. Accessibilité AA. Éditorial lisible sans JS.
- Images AVIF/WebP avec repli, dimensionnées, chargement différé.
- SEO : sitemap, meta et Open Graph par page, URL propres et stables.
- Redirections 301 : inventaire des URL actuelles, table ancienne → nouvelle validée par le
  dirigeant, générée en `.htaccess`. Aucune URL actuelle en 404 après bascule.
- Docs (`docs/`) : `EDITION.md`, `DEPLOIEMENT.md`, `3D.md`, `BASCULE.md`, `REPRISE.md`.

## Lots

0. Mise en place (comptes, dépôt, CMS + relais OAuth PHP, hébergement, mail d'envoi,
   squelette Astro, CI/CD). Fin : page « en construction » en ligne, une modification CMS
   arrive seule sur l'URL provisoire. Rien d'autre avant.
1. Design : trois maquettes d'accueil en HTML réel, partis pris distincts. Choix, puis affinage.
2. Socle : blocs, CMS, pages fixes, formulaire, Matomo + rapport, mentions légales.
3. Portfolio : une machine 3D de bout en bout, go / no-go, puis les cinq autres.
4. Modules : quiz, squelette simulateur carbone, emplacement réversibilité.
5. Finitions : SEO, redirections, bascule, docs, Lighthouse, recette.

## État d'avancement

- 2026-09-02 : lot 0 démarré. Squelette Astro créé. Organisation GitHub `automachine-net`
  créée (`automachine` était déjà pris). Compte du dirigeant : `StanislasMoreau`.
- **État provisoire, décidé par le dirigeant le 2026-09-02** : phase de test gratuite sur
  GitHub Pages, dépôt `automachine-net.github.io` **public**, connexion au CMS par jeton
  personnel (sans relais PHP). Tant que le dépôt est public : aucun secret, aucune adresse
  mail dans le dépôt. Passage en dépôt privé + relais OAuth PHP + rsync vers Infomaniak
  quand l'hébergement sera souscrit. Le formulaire de contact et Matomo attendent Infomaniak.
