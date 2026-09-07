# Reprendre le projet

Ce qu'un développeur extérieur doit savoir pour reprendre ce site en une heure.

## En une phrase

Site vitrine statique en Astro, contenu en Markdown et JSON versionnés dans Git, édité par
Sveltia CMS avec GitHub comme dépôt, construit et déployé automatiquement par GitHub Actions.

## Le principe à ne pas casser

Le contenu vit dans des fichiers texte du dépôt, jamais dans une base de données. Si tous les
outils disparaissent, le site doit rester modifiable avec un simple éditeur de texte. Toute
proposition qui déplacerait le contenu ailleurs va contre la raison d'être du projet.

## Mise en route

```bash
npm install
npm run dev
```

Le site tourne sur `http://localhost:4321`. `npm run build` produit le site dans `dist/`.

## Vérifier et formater

| Commande                     | Effet                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `npm run verifier`           | Vérification de types de tout le projet. Lancée aussi par `build`.                  |
| `npm run formater`           | Met tout le code en forme selon `.prettierrc`.                                      |
| `npm run formater:controler` | Dit si un fichier s'écarte de cette forme, sans rien modifier.                      |
| `npm run detourer`           | Retire les marges transparentes des rendus de machines. Lancé par `build` et `dev`. |

La construction échoue sur une erreur de type, sur un champ inconnu dans un fichier de
contenu, et sur un type de bloc mal orthographié. Elle ne se soucie pas de la présentation du
code : le formateur n'est pas dans l'intégration continue, pour qu'un écart de style ne
bloque jamais une publication.

## Où se trouve quoi

| Chemin                              | Contenu                                                                             |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `content/pages/`                    | Une page du site par fichier, en Markdown avec frontmatter.                         |
| `content/machines/`                 | Une fiche machine par fichier.                                                      |
| `content/quiz/`                     | Les questions du quiz, en JSON.                                                     |
| `content/reglages/`                 | Coordonnées, menus, clients, secteurs, informations légales.                        |
| `src/pages/`                        | Les routes. Chaque fichier produit une adresse.                                     |
| `src/layouts/Base.astro`            | Le gabarit commun : balises de tête, en-tête, pied de page.                         |
| `src/components/blocs/`             | La bibliothèque de blocs, un composant par type.                                    |
| `src/components/Blocs.astro`        | Le répartiteur : associe un type de bloc à son composant.                           |
| `src/components/modules/`           | Les outils interactifs (quiz, simulateurs, modules de conférence).                  |
| `src/components/EntetePage.astro`   | L'en-tête des pages écrites en code : fil d'Ariane, titre, chapeau.                 |
| `src/components/ImageContenu.astro` | Toute image venue du CMS passe par lui : tailles, formats, repli.                   |
| `src/content.config.ts`             | Les schémas de validation du contenu, stricts.                                      |
| `src/images/`                       | Les images de contenu déposées par le CMS, traitées à la construction.              |
| `src/integrations/`                 | Nos intégrations Astro : les pages en chantier sortent du référencement.            |
| `src/scripts/dom.ts`                | Les deux gestes communs aux modules : monter chaque exemplaire, trouver un élément. |
| `src/scripts/filaire.ts`            | Les volumes 3D filaires, dessinés au canvas, sans bibliothèque.                     |
| `src/styles/base.css`               | Les jetons de couleur, les typographies, les styles communs.                        |
| `construction/`                     | Scripts lancés avant la construction (détourage des rendus).                        |
| `public/admin/config.yml`           | La configuration du CMS.                                                            |
| `public/fonts/`                     | Les polices auto-hébergées, en woff2.                                               |
| `.github/workflows/`                | La construction et le déploiement automatiques.                                     |

## Ajouter un type de bloc

Quatre fichiers doivent rester d'accord, sinon la construction échoue :

1. `src/components/blocs/MonBloc.astro` — le composant.
2. `src/components/Blocs.astro` — l'ajouter au dictionnaire `composants`.
3. `src/content.config.ts` — ajouter son objet dans l'union `bloc`.
4. `public/admin/config.yml` — ajouter son type dans la liste `blocs` pour qu'il apparaisse
   dans l'interface d'édition.

Les schémas sont stricts : les champs déclarés dans `content.config.ts` et dans `config.yml`
doivent être exactement les mêmes, sinon un contenu enregistré depuis le CMS fait échouer la
construction. Un champ court venu du CMS s'affiche à travers `typo()` (typographie
française), un champ Markdown à travers `marked()` ; on n'injecte jamais un champ brut comme
HTML.

## Ajouter un module interactif

Un module peut être posé plusieurs fois dans une même page par le bloc « module ». Son
script ne cherche donc jamais « le » formulaire dans la page entière : il monte chaque
exemplaire avec `chaqueExemplaire()` et trouve ses éléments avec `element()`, tous deux
dans `src/scripts/dom.ts`. Pas d'assertion `!` : `element()` échoue avec un message clair si
un élément manque. Un module qui porte des `id` les préfixe par exemplaire, comme les deux
simulateurs. Enfin, le nouveau module s'ajoute à la liste du bloc « module » (composant,
schéma, CMS) en même temps qu'il est créé.

## Dépendances, et pourquoi

Le projet en compte volontairement très peu. Chacune est justifiée :

- **astro** — le générateur de site statique lui-même. Il apporte **sharp**, la bibliothèque
  de traitement d'images utilisée par la chaîne d'images et par le détourage des rendus.
- **@astrojs/sitemap** — extension officielle qui produit le plan du site à la construction.
- **@google/model-viewer** — la visionneuse glTF, seul composant standard pour ce format,
  chargée uniquement sur les fiches qui ont un fichier 3D, servie depuis notre domaine.
- **marked** — convertit en HTML le Markdown saisi dans le CMS, à la construction seulement.
  Le moteur Markdown interne d'Astro ferait le travail, mais son nom de paquet change d'une
  version à l'autre : `marked` a une interface stable depuis des années.
- **@sveltia/cms** — l'éditeur lui-même, copié dans `public/admin/` à chaque construction
  pour éviter tout appel à un serveur tiers depuis le navigateur du visiteur.

En développement seulement, jamais envoyées au visiteur : **typescript** et
**@astrojs/check** pour la vérification de types, **prettier** et **prettier-plugin-astro**
pour la mise en forme du code.

Aucune bibliothèque n'est chargée depuis un CDN. Aucun script tiers ne tourne chez le
visiteur. Les volumes 3D sont dessinés à la main au canvas, sans three.js.

## Contraintes à connaître

- **Hébergement final : Infomaniak mutualisé.** HTML, CSS, JavaScript, PHP, Python, MySQL.
  Pas de Node.js côté serveur. Tout ce qui est dynamique est soit côté client, soit un
  script PHP minimal.
- **Aucun service tiers côté client.** Pas de Google Fonts, pas d'analytique tierce, pas de
  captcha externe, pas de CDN.
- **Accessibilité AA obligatoire**, contrastes vérifiés par calcul, pas à l'œil. Les règles
  d'usage des couleurs sont écrites en tête de `src/styles/base.css`.
- **Le contenu éditorial doit rester lisible sans JavaScript.**
- **Français uniquement.** Aucune internationalisation à prévoir.

## État au 2 septembre 2026

Phase de test sur GitHub Pages, dépôt public. Le formulaire de contact et Matomo attendent
la souscription de l'hébergement Infomaniak. Les modèles 3D issus de la CAO ne sont pas
encore produits : des volumes filaires en tiennent lieu.

Les décisions du projet, toutes prises par le dirigeant, sont condensées dans `CLAUDE.md`
à la racine. Les lire avant de proposer quoi que ce soit.
