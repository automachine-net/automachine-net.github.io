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
  3D ; nom du client seulement avec accord écrit, sinon secteur),
  `/outils/quiz-reglement-machines`, `/outils/simulateur-carbone`, `/outils/reversibilite`,
  `/contact`, `/mentions-legales`, `/confidentialite`.
- **`/secteurs` supprimé (2026-09-02)** : pas assez de matière pour une page par secteur.
  Les secteurs servis sont annoncés dans l'introduction de l'accueil, rappelés par cinq
  pictogrammes dessinés au trait, et repris à l'intérieur des pages Entreprise et Machines.
  Retiré aussi du menu principal.
- Pages composées de blocs prédéfinis éditables dans le CMS : hero, texte, texte + image,
  galerie, chiffres clés, fiche machine, visionneuse 3D, citation, appel à l'action, FAQ,
  module. Critère : créer une page complète depuis le CMS sans développeur.
- Textes : tout réécrit, rien repris de l'ancien site. Non rédigé = `[À RÉDIGER]`.
  Jamais de lorem ipsum, de texte inventé, de chiffre ou de client fictif.
- **Certifications (2026-09-02)** : ISO 9001 et ISO 14001 ont été obtenues puis **non
  reconduites**, la charge étant disproportionnée pour une TPE. Le site dit qu'elles ont été
  obtenues, qu'elles n'ont pas été reconduites et pourquoi, et que les méthodes de travail
  issues de ces référentiels sont restées. Ne jamais écrire ni laisser entendre que les
  certifications sont encore valides. Le dirigeant a fait retirer la phrase explicite
  « nous ne revendiquons aucune certification en cours » : ne pas la réintroduire.
  Années d'obtention et d'arrêt à compléter par le dirigeant.
- **Logos clients (2026-09-02)** : droit d'usage confirmé par le dirigeant pour Airbus, SNCF,
  EDF, CEA, Faiveley Transport, Filtratech et Yoteq. Section « Ils nous ont fait confiance ».
- **Illustrations de secteurs fournies : écartées.** Vectoriels d'aspect banque d'images,
  vingt à quarante couleurs hors palette, correspondant à l'anti-référence du brief.
  Remplacées par cinq pictogrammes au trait dessinés dans la palette
  (`src/components/IconeSecteur.astro`).

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
- **2026-09-04, lot 3 amorcé** : champ « Fichier 3D (.glb) » sur chaque fiche machine dans le
  CMS (téléversement dans `public/modeles/`), visionneuse `<model-viewer>` (dépendance
  `@google/model-viewer`, seul composant standard pour glTF, chargé uniquement sur les fiches
  qui ont un fichier, servi depuis notre domaine). Le dirigeant a exporté un STEP de 33 Mo :
  inutilisable tel quel, il faut un maillage OBJ nettoyé, converti en `.glb` (obj2gltf +
  gltf-pipeline, hors projet) ; procédure dans `docs/3D.md`.
- **2026-09-04, première machine affichée** : bobineuse ESRF, `.glb` Draco de 6,9 Mo et
  4,5 M de triangles fourni par le dirigeant, affiché ; version allégée à 2,4 Mo et 1,06 M de
  triangles (`gltf-transform optimize`, hors projet) déposée à côté pour comparaison.
  Décodeur Draco auto-hébergé dans `public/decodeurs/draco/`. Champ CMS en chemin absolu
  (`/public/modeles`). Cartes et liste : modèle chargé au clic seulement (`reveal=interaction`).
  **Go / no-go mobile toujours à faire par le dirigeant.**
- **2026-09-04, retour du dirigeant sur la 3D** : le rendu est jugé inutilisable. Mesuré dans
  le fichier : 911 pièces mais une seule matière grise, noms de pièces perdus, apparences de
  Fusion non exportées. Une couleur ajoutée ici serait inventée. L'allègement agressif
  (272 000 triangles, 1,1 Mo) casse la géométrie : abandonné. **Décision : passer à
  l'animation vidéo en boucle**, calculée dans Fusion où les matières et l'éclairage existent
  déjà. Deux champs CMS par machine (« Animation (.mp4) », « Image d'attente ») ; quand une
  animation existe, elle remplace la visionneuse sur la fiche. Attentes techniques (poids,
  durée, boucle fermée) dans `docs/3D.md`. La visionneuse glTF reste en place pour un futur
  modèle correctement exporté.
- Cinématiques animées dans Fusion, exportées en vidéo courte, intégrées en boucle muette.
  Procédure complète dans `docs/3D.md`.

## Modules interactifs

Chaque module : composant autonome, URL dédiée, image Open Graph propre, extrait d'intégration
via le bloc « module ». Aucune donnée personnelle collectée.

1. Quiz règlement machines. Parcours Pro : règlement (UE) 2023/1230 vs directive 2006/42/CE,
   64 questions fournies en CSV → JSON éditable dans le CMS, retour immédiat coloré au clic.
   Parcours Découverte : court, grand public, à rédiger ensemble. Compte à rebours vers le
   20 janvier 2027. Mention obligatoire : contenu informatif, pas un conseil juridique.
2. Simulateur d'empreinte carbone. Non public (non indexé) tant que les ratios de calage ne
   sont pas fournis. Entrées grossières (masse, répartition matériaux, puissance, heures/an,
   durée de vie), France uniquement. Sortie en fourchette, jamais un chiffre unique,
   décomposition fabrication / transport / usage / fin de vie, hypothèses affichées.
   Facteurs : Base Empreinte (ADEME), PEP ecopassport, dans un JSON séparé sourcé ligne par
   ligne. Aucun qualificatif environnemental (« bas carbone », « vert », « neutre »…) :
   directive (UE) 2024/825 dès le 27/09/2026.
   - **Rien de ce qui relève du suivi interne ne s'affiche sur le site** : approximations à
     lever, données manquantes, arbitrages en attente. Ces points vivent ici.
   - **Reste à faire avant publication** : (a) ratios de calage sur machines livrées, à
     fournir par Automachine, sans quoi la fourchette est cohérente mais invérifiable ;
     (b) dépouiller les PEP ecopassport pour remplacer le facteur approché de l'armoire
     électrique (variateur employé comme substitut) ; (c) trancher le sort de la fin de vie,
     aujourd'hui non chiffrée et hors du total.
   - **Approximations en cours** : inox (aucun facteur générique dans la base, un fil de
     palissage à 100 % d'incertitude en tient lieu), armoire électrique (variateur),
     câblage (ramené à son cuivre).
   - **Pas de facteur de robot industriel** dans la Base Empreinte, ni de machine
     industrielle pour la comparaison : seule la voiture sert de repère. Le lave-linge,
     essayé, a été écarté par le dirigeant comme non pertinent.
3. Animation réversibilité : module et emplacement prévus, scénario à construire ensemble.
   **Modules de conférence (2026-09-03)** : le dirigeant réutilise certains modules pendant
   sa conférence sur la réversibilité. Exigences : pilotage au clavier (flèches, espace),
   plein écran, gros caractères, fonctionnement hors connexion une fois la page ouverte.
   - **Flux de matières** (`/outils/flux-matieres`, livré 2026-09-03) : schéma de flux animé
     en sept étapes, données SDES 2019 dans `content/donnees/flux-matieres.json` (valeurs
     publiées reprises telles quelles, écart de bouclage d'environ 20 Mt signalé, non
     corrigé). Dessin original, seules les valeurs sont reprises. Textes d'étapes à relire.
     Le cumul « perdu » calculé donne 36 % (5,5 + 30,7) ; le dirigeant dit 35 % à l'oral.
   - **Boucle ou hélice** (`/outils/reversibilite`, livré 2026-09-03) : cycle de dix tours
     en perspective, piloté par quatre curseurs, un par critère de réversibilité (coût,
     qualité, délai, pertes par cycle). Critères tenus, les tours se superposent en une
     boucle ; critère dépassé, chaque tour descend vers le sol « déchet » (Bréchet :
     « économie hélicoïdale »). Seuils : coût ≤ fabrication, qualité = fonction initiale,
     délai < temps d'usage (fixes, ceux du dirigeant) ; pertes réglable, 1 % par défaut.
     Le lien entre dépassement et descente est un choix de dessin, pas une mesure. Libellés,
     bornes et verdicts dans `content/donnees/reversibilite.json`, à relire.
4. **Estimateur d'ordre de prix (idée du dirigeant, 2026-09-02)** : donner un ordre de grandeur
   avant un premier contact. Pistes d'entrées évoquées : encombrement de la machine, nombre de
   robots, niveau de sécurité demandé. Méthode, bornes et avertissements à arrêter avec le
   dirigeant avant toute mise en ligne. Rien n'est développé tant que la méthode n'est pas
   validée : un ordre de prix public engage l'entreprise.
   - **2026-09-04** : six dossiers de chiffrage déposés dans `ressources/chiffrages/` (exclu du
     dépôt). Dépouillement et ébauche de méthode dans `ressources/chiffrages/SYNTHESE-prechiffrage.md`
     (confidentiel, jamais dans le dépôt). Modèle additif par postes (socle, axes, robots, vision,
     sécurité, encombrement, installation), fourchette −25 % / +35 %, calibré sur cinq machines.
     Les dossiers CEA restent confidentiels.
   - **2026-09-04, réponses du dirigeant** (détail chiffré dans la synthèse, hors dépôt) :
     l'outil chiffre tout (étude seule, fabrication seule, rétrofit, machine neuve, robots sans
     limite) ; plus de questions plutôt que pas assez, « à la louche » et « au détail » comme le
     simulateur carbone ; avertissement : « À titre indicatif : peut fluctuer selon la nature
     de la machine et la complexité de la solution technique » ; pas de surcoût nucléaire
     (pas de nucléaire pour l'instant).
   - **Livré (2026-09-04)** : `/outils/estimateur-prix`, modèle dans `content/donnees/prix.json`,
     calcul dans `src/scripts/prix.ts`. Le JSON ne contient aucun client ni prix réel. Page non
     indexée tant que le dirigeant n'a pas validé les valeurs.
   - **Marge en clair (décision du dirigeant, 2026-09-04, après avertissement)** : les montants
     du JSON sont des **coûts hors taxes** ; la marge (`marge_pct`) et l'indice vivent dans
     `content/donnees/prix-indice.json`, réglables dans le CMS. Le dirigeant a été averti que
     la marge est lisible dans le dépôt public et dans le code envoyé au navigateur ; il l'a
     voulue ainsi. Le taux journalier, lui, n'apparaît nulle part (les jours sont convertis en
     euros dans le JSON).
   - **Indice de prix** (`content/donnees/prix-indice.json`, réglable dans le CMS, rubrique
     Outils) : un seul coefficient multiplie tous les montants, pour suivre l'inflation sans
     retoucher le modèle. 1 = niveau de septembre 2026.
   - **CMS (2026-09-04)** : la collection « Quiz » est remplacée par une collection « Outils »
     qui regroupe quiz, facteurs carbone, indice de prix, étapes du flux de matières et
     critères de réversibilité. Le modèle complet de l'estimateur (`prix.json`) n'y est pas
     exposé : structure trop variable pour être déclarée champ par champ sans risque de perte
     à l'enregistrement ; il s'édite dans le fichier.
   - **ATEX** : partie fixe (certification, documentation) + coefficients sur le matériel des
     postes à composants électriques (règle du dirigeant : × 2 sur l'électrique et
     l'électronique, × 1,5 sur les robots, appliquée au prorata de la part électrique de chaque
     poste). « Mise en position » : « large » au-delà du millimètre, le millimètre est déjà une
     exigence.
- Pas de « quiz découverte » : idée abandonnée par le dirigeant, remplacée par des outils
  réellement utiles au client (empreinte carbone, ordre de prix).
- **Accueil : un bloc par outil**, titré par ce que fait l'outil ou son sujet. Jamais de bloc
  parapluie « Outils ». Pas de texte parasite (score, thème de question, mentions de nombre
  de questions qui peuvent décourager).

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
- 2026-09-02 : **lot 0 validé dans sa version gratuite.** Circuit complet vérifié : une
  modification enregistrée dans le CMS par le dirigeant (commit « Update Page “accueil” »)
  est apparue sur `https://automachine-net.github.io/` sans intervention, en moins de trois
  minutes. Reste à faire à la souscription Infomaniak : relais OAuth PHP, compte mail
  d'envoi, déploiement rsync, passage du dépôt en privé.
- 2026-09-02 : **lot 1 en cours.** Trois maquettes proposées (`/maquettes/a`, `b`, `c`), puis
  une maquette de synthèse (`/maquettes/finale`) retenue par le dirigeant : base interactive
  et contrastée de la B, bandeau et sommaire latéral de la C, cartes machines à faire défiler
  (plusieurs machines visibles d'un coup), un bloc par outil, section clients.
  La section « le défilement pilote le mouvement » a été retirée : trop de travail pour le
  résultat, et elle cassait le rythme de navigation.
  Les 64 questions du quiz sont importées dans `content/quiz/reglement-machines.json`.
- 2026-09-02 : **lot 2a livré** (blocs, CMS, pages fixes, pages légales, documentation).
- **Décision du dirigeant (2026-09-02) : l'hébergement Infomaniak ne sera pas souscrit tant
  que toutes les autres fonctions n'auront pas été testées et approuvées.** Le lot 2b
  (formulaire de contact en PHP, compte mail d'envoi, Matomo et son rapport mensuel) reste
  donc en attente, ainsi que le relais OAuth PHP, le déploiement rsync et le passage du dépôt
  en privé. Ne pas relancer sur ce point : c'est au dirigeant de dire quand.
