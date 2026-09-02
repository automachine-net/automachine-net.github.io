# Déploiement

Ce document explique ce qui se passe quand on enregistre une modification, où regarder si ça
échoue, et comment modifier les destinataires des mails. Il est mis à jour au fil du projet.

## État actuel : phase de test sur GitHub Pages (depuis le 2 septembre 2026)

- Dépôt : `https://github.com/automachine-net/automachine-net.github.io` (public).
- Site provisoire : `https://automachine-net.github.io/`.
- Hébergement final Infomaniak : pas encore souscrit. Cette section sera remplacée à la bascule.

## Ce qui se passe quand on enregistre

1. Une modification arrive sur la branche `main` du dépôt, soit depuis le CMS, soit par un
   envoi Git depuis un ordinateur.
2. GitHub Actions lance automatiquement le workflow « Déploiement »
   (fichier `.github/workflows/deploy.yml`).
3. Le workflow installe Node.js, construit le site avec Astro, puis publie le dossier `dist/`
   sur GitHub Pages.
4. Deux à trois minutes plus tard, le site provisoire affiche la modification.

Aucune étape manuelle. Il n'y a rien à faire d'autre qu'enregistrer.

## Où regarder si ça échoue

1. Ouvrir `https://github.com/automachine-net/automachine-net.github.io/actions`.
2. Chaque ligne est un déploiement. Une coche verte : réussi. Une croix rouge : échec.
3. Cliquer sur la ligne en échec, puis sur l'étape marquée en rouge : le message d'erreur est
   affiché en bas du journal.
4. Cas fréquents :
   - Erreur dans un fichier de contenu (Markdown ou JSON mal formé) : corriger le fichier dans
     le CMS ou dans GitHub, enregistrer, le déploiement repart tout seul.
   - Panne GitHub : attendre, puis relancer via le bouton « Re-run all jobs » en haut à droite
     du déploiement en échec.

## Relancer un déploiement à la main

Onglet **Actions** du dépôt, workflow « Déploiement » dans la colonne de gauche, bouton
**Run workflow**, puis **Run workflow** à nouveau pour confirmer.

## Destinataires des mails

Pas encore en place : le formulaire de contact et le rapport Matomo arrivent avec
l'hébergement Infomaniak (lot 2). Tant que le dépôt est public, aucune adresse mail n'y est
stockée.

## Note pour le jour de la bascule

L'adresse d'envoi Infomaniak du formulaire de contact devra être ajoutée à l'enregistrement
SPF du domaine `automachine.net`. Voir `docs/BASCULE.md`.
