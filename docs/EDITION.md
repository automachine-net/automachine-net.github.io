# Modifier le site

Notice pas à pas pour modifier le contenu du site depuis l'interface d'administration.
Le site est édité rarement : cette notice part de zéro à chaque fois.

## Où se trouve l'administration

- Pendant la phase de test : `https://automachine-net.github.io/admin/`
- Après la bascule : `https://automachine.net/admin/`

## 1. Se connecter

Pendant la phase de test, chaque éditeur se connecte avec un « jeton d'accès » GitHub
personnel. Un jeton est un mot de passe long, propre à une personne, qu'on ne partage jamais.

1. Ouvrir l'adresse de l'administration.
2. Cliquer sur **Se connecter avec un jeton d'accès**.
3. Si vous n'avez pas encore de jeton, cliquer sur le lien vers les paramètres GitHub proposé
   dans la fenêtre. Un formulaire s'ouvre. Le remplir ainsi :
   - **Token name** : `Sveltia CMS`.
   - **Expiration** : la durée de votre choix. Passé ce délai, il faudra en refaire un.
   - **Resource owner** : choisir **automachine-net**, l'organisation, pas votre compte
     personnel.
   - **Repository access** : « Only select repositories », puis cocher
     `automachine-net.github.io`.
   - **Permissions**, section Repository : cliquer **Add permissions**, chercher **Contents**,
     le cocher, puis choisir **Read and write** dans le menu déroulant à droite. Ne rien
     ajouter d'autre. Une ligne « Metadata » en lecture seule s'ajoute toute seule : c'est
     normal, la laisser.
   - Cliquer **Generate token**, puis copier le jeton affiché. Il n'est montré qu'une fois.
4. Revenir dans l'administration, coller le jeton, cliquer **Se connecter**.
5. Le navigateur retient la connexion. Les fois suivantes, l'administration s'ouvre directement.

Après la bascule vers Infomaniak, la connexion se fera par le bouton **Se connecter avec
GitHub**, sans jeton. Cette section sera mise à jour à ce moment-là.

## 2. Ce que contient l'administration

La colonne de gauche présente quatre rubriques.

| Rubrique     | Ce qu'on y modifie                                                          |
| ------------ | --------------------------------------------------------------------------- |
| **Pages**    | Les pages du site : accueil, entreprise, machines, contact.                  |
| **Machines** | Une fiche par machine réalisée.                                             |
| **Quiz**     | Les questions du quiz sur le règlement machines.                            |
| **Réglages** | Coordonnées, menus, logos des clients, secteurs, informations légales.       |

## 3. Modifier un texte

1. Cliquer sur **Pages**, puis sur la page voulue.
2. Modifier les champs. Le champ **Texte** accepte la mise en forme : gras, titres, listes,
   liens, avec la barre d'outils.
3. Cliquer **Enregistrer** en haut à droite.
4. Attendre deux à trois minutes : le site en ligne se met à jour tout seul. Rien d'autre à
   faire. Si rien ne change au bout de dix minutes, voir `docs/DEPLOIEMENT.md`.

## 4. Créer une page

1. Cliquer sur **Pages**, puis sur le bouton de création (le crayon, en bas à droite).
2. Remplir **Nom de la page dans cette interface** : c'est ce qui vous permettra de la
   retrouver dans la liste. Il n'apparaît nulle part sur le site.
3. Remplir le **Titre de la page**, qui apparaît lui dans l'onglet du navigateur et dans les
   résultats de recherche, puis la description.
4. Empiler les blocs, comme pour n'importe quelle page (voir la section suivante).
5. Enregistrer. La page obtient automatiquement son adresse, tirée de son nom : une page
   nommée « Services » sera à l'adresse `/services`.
6. **Pour qu'on puisse y accéder**, ajouter une entrée au menu : **Réglages**, puis **Menus**,
   puis **Menu du haut**. Sans cela, la page existe mais aucun lien n'y mène.

## 5. Construire une page avec des blocs

Une page est une pile de **blocs**, empilés de haut en bas. Chaque bloc est un morceau de
page : un en-tête, un texte, une galerie, un outil interactif.

Dans le champ **Blocs de la page** :

- **Ajouter** un bloc : bouton `+`, puis choisir son type dans la liste.
- **Déplacer** un bloc : le faire glisser par sa poignée, ou utiliser les flèches.
- **Replier** un bloc : cliquer sur son titre, pour y voir clair quand la page est longue.
- **Supprimer** un bloc : menu du bloc, puis supprimer.

### Les blocs disponibles

| Bloc                    | À quoi il sert                                                        |
| ----------------------- | --------------------------------------------------------------------- |
| **En-tête de page**     | Le haut d'une page : surtitre, grand titre, chapeau, boutons.          |
| **Texte**               | Un titre et un texte libre.                                           |
| **Texte et image**      | Un texte à côté d'une image, à gauche ou à droite.                    |
| **Galerie d'images**    | Plusieurs images en grille.                                           |
| **Chiffres clés**       | Des nombres avec leur légende, sur une ligne.                         |
| **Cartes de machines**  | Les machines à faire défiler, avec leur volume manipulable.           |
| **Visionneuse 3D**      | Un volume manipulable en grand.                                       |
| **Citation**            | Une phrase mise en avant, avec son auteur.                            |
| **Appel à l'action**    | Un titre, un texte court et un bouton, centrés.                       |
| **Questions fréquentes**| Des questions qui se déplient au clic.                                |
| **Module interactif**   | Le quiz, le compte à rebours, ou un cadre d'attente.                  |
| **Logos des clients**   | La bande de logos. Les logos se modifient dans Réglages.              |

Presque tous les blocs ont un champ **Fond** : blanc, gris clair ou bleu nuit. C'est ce qui
donne le rythme de la page. Alterner sans excès, deux ou trois fonds sombres par page suffisent.

## 6. Ajouter une machine

1. **Machines**, puis le bouton pour créer une fiche.
2. Remplir le nom, l'ordre d'affichage, le secteur, le résumé et la description.
3. **Nom du client** : ne le remplir **que** si le client a donné son accord écrit. Sinon,
   laisser vide, et seul le secteur sera affiché.
4. **Fiche technique** : ajouter autant de lignes que nécessaire, chacune avec un libellé et
   une valeur.
5. Enregistrer. La machine apparaît automatiquement sur la page Machines et sur l'accueil.

## 7. Changer une coordonnée, un menu, un logo

Tout est dans **Réglages** :

- **Coordonnées et réglages généraux** : adresse, téléphone, adresse électronique. Modifier
  ici met à jour le pied de page, les mentions légales et la page de confidentialité d'un coup.
- **Menus** : les entrées du bandeau du haut et du pied de page.
- **Logos des clients** : la bande « Ils nous ont fait confiance ».
- **Secteurs** : les cinq secteurs et leurs pictogrammes.
- **Informations légales** : ce qui alimente la page des mentions légales.

## 8. Les repères à remplir

Le site contient des repères entre crochets, laissés volontairement visibles :

- `[à relire]` : un texte rédigé qui attend votre relecture. À conserver ou à réécrire,
  puis à retirer.
- `[À COMPLÉTER : ...]` : une information que seule l'entreprise possède, par exemple une
  année, une cadence ou un montant.

Ces repères s'affichent en italique gris sur le site. Ils sont là pour être vus, et pour
disparaître au fur et à mesure.

## Ce qu'il ne faut pas faire

- Ne jamais partager son jeton ni son compte GitHub.
- Ne pas modifier depuis GitHub les fichiers des dossiers `src/` ou `.github/` : ce sont les
  fichiers techniques du site. Le contenu est uniquement dans `content/` et `public/images/`.
