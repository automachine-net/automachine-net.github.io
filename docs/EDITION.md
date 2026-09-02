# Modifier le site

Notice pas à pas pour modifier le contenu du site depuis l'interface d'administration
(Sveltia CMS). Le site est édité rarement : cette notice part de zéro à chaque fois.
Les captures d'écran seront ajoutées quand l'interface finale sera en place.

## Adresse de l'administration

- Phase de test : `https://automachine-net.github.io/admin/`
- Après la bascule : `https://automachine.net/admin/`

## Se connecter (phase de test, connexion par jeton)

Pendant la phase de test, chaque éditeur se connecte avec un « jeton d'accès » GitHub
personnel. Un jeton est un mot de passe long, propre à une personne, qu'on ne partage jamais.

1. Ouvrir l'adresse de l'administration.
2. Cliquer sur **Se connecter avec un jeton d'accès**.
3. Si vous n'avez pas encore de jeton, cliquer sur le lien « paramètres utilisateur de GitHub »
   dans la fenêtre. GitHub ouvre un formulaire de création de jeton pré-rempli :
   - **Token name** : `Sveltia CMS` (déjà rempli).
   - **Expiration** : choisir la durée souhaitée. À l'expiration, il faudra refaire un jeton.
   - **Resource owner** : choisir **automachine-net** (l'organisation), pas votre compte.
   - **Repository access** : **Only select repositories**, puis cocher
     `automachine-net.github.io`.
   - **Permissions**, section Repository : **Contents** doit être sur **Read and write**
     (déjà réglé par le lien). Ne rien ajouter d'autre.
   - Cliquer **Generate token**, puis copier le jeton affiché. Il n'est montré qu'une fois.
4. Revenir dans l'administration, coller le jeton, cliquer **Se connecter**.
5. Le navigateur retient la connexion : les fois suivantes, l'administration s'ouvre directement.

Après la bascule vers Infomaniak, la connexion se fera par le bouton **Se connecter avec
GitHub**, sans jeton. Cette section sera mise à jour.

## Modifier un texte

1. Dans la colonne de gauche, cliquer sur la collection concernée (par exemple **Pages**).
2. Cliquer sur la page à modifier.
3. Modifier les champs. Le champ **Texte** accepte la mise en forme (gras, titres, listes,
   liens) via la barre d'outils.
4. Cliquer **Enregistrer** en haut à droite.
5. Attendre deux à trois minutes : le site en ligne se met à jour tout seul. Rien d'autre à
   faire. Si rien ne change au bout de dix minutes, voir `docs/DEPLOIEMENT.md`.

## Ce qu'il ne faut pas faire

- Ne jamais partager son jeton ni son compte GitHub.
- Ne pas modifier les fichiers du dossier `src/` ou `.github/` depuis GitHub : ce sont les
  fichiers techniques du site. Le contenu est uniquement dans `content/` et `public/images/`.
