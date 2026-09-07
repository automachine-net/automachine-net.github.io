# Bascule vers automachine.net

Ce que l'on fait, dans l'ordre, le jour où le site remplace l'ancien sur le domaine définitif.
Rien de ce document n'est à faire avant que l'hébergement Infomaniak soit souscrit et que le
lot 2b (formulaire, courriel d'envoi, déploiement rsync, dépôt privé) soit livré.

Périmètre rappelé : on ne touche ni au registrar, ni aux serveurs de courrier, ni à EX2,
Mailinblack ou Microsoft 365. La seule modification DNS est celle qui pointe le site web
vers Infomaniak, faite par le dirigeant sur les indications d'Infomaniak.

## 1. Avant la bascule

- [ ] Hébergement Infomaniak souscrit, site déployé dessus par rsync depuis GitHub Actions
      (`docs/DEPLOIEMENT.md`), accessible par son adresse provisoire Infomaniak.
- [ ] Dépôt passé en privé, relais OAuth PHP en place, connexion au CMS vérifiée.
- [ ] `content/reglages/site.json` : adresse électronique renseignée (elle n'apparaît nulle
      part tant que le dépôt est public), `formulaire_actif` à vrai une fois le PHP testé.
- [ ] Un courriel de test envoyé par le formulaire, reçu, sans passer en indésirable.
- [ ] Table des redirections ci-dessous validée par le dirigeant.
- [ ] Copie de l'ancien site conservée (export de l'hébergeur actuel), au cas où.

## 2. Le jour même

1. **Adresse du site** : dans `astro.config.mjs`, remplacer `SITE` par `https://automachine.net`.
   Le plan du site, les adresses canoniques, les balises de partage et `robots.txt` en
   découlent. Un commit, une publication.
2. **DNS** : faire pointer `automachine.net` et `www.automachine.net` vers l'hébergement
   Infomaniak, selon les valeurs données dans la console Infomaniak. Ne rien changer aux
   enregistrements MX ni à ceux de Microsoft 365.
3. **SPF** : ajouter l'inclusion Infomaniak à l'enregistrement SPF du domaine, pour que les
   courriels du formulaire ne soient pas rejetés. La valeur exacte est fournie par
   Infomaniak ; à recopier telle quelle, sans supprimer ce qui existe.
4. **Certificat** : activer le certificat Let's Encrypt dans la console Infomaniak une fois le
   DNS propagé, et forcer HTTPS.
5. **Redirections** : le fichier `public/.htaccess` est publié avec le site. Vérifier une par
   une les adresses de la table ci-dessous : chacune doit répondre par une redirection
   permanente (code 301) vers la nouvelle page.

## 3. Après la bascule

- [ ] Ouvrir chaque adresse de l'ancien site : aucune erreur 404.
- [ ] `https://automachine.net/sitemap-index.xml` répond et ne liste que les pages publiques.
- [ ] Déclarer le site dans la console des moteurs de recherche et soumettre le plan du site.
- [ ] Vérifier une vignette de partage en collant un lien dans une messagerie.
- [ ] Mettre à jour les liens vers le site sur LinkedIn et dans les signatures de courriel.
- [ ] Le jour où Matomo est installé : passer `statistiques_actives` à vrai dans les
      réglages, la page Confidentialité se met à jour toute seule.

## 4. Table des redirections proposée

Inventaire fait le 7 septembre 2026 à partir du plan de site de l'ancien site et des liens de
sa page d'accueil. **À valider par le dirigeant** : une adresse mal redirigée envoie un
visiteur au mauvais endroit, une adresse oubliée l'envoie sur une erreur.

| Ancienne adresse                                                   | Nouvelle page              |
| ------------------------------------------------------------------ | -------------------------- |
| `/`                                                                | `/`                        |
| `/accueil-automachine-concepteur-et-fabricant-de-machine-speciale` | `/`                        |
| `/plan-du-siteautomachine`                                         | `/`                        |
| `/notre-histoire`                                                  | `/entreprise`              |
| `/notre-equipe`                                                    | `/entreprise`              |
| `/notre-politique`                                                 | `/entreprise`              |
| `/les-prestations-d-automachine`                                   | `/entreprise`              |
| `/les-moyens-utilises`                                             | `/entreprise`              |
| `/nos-domaines-de-competences` et sa variante longue               | `/entreprise`              |
| `/les-secteurs-d-interventions`, `/nos-secteurs-d-interventions`   | `/entreprise`              |
| `/ils-nous-ont-fait-confiance` et sa variante longue               | `/entreprise`              |
| `/portfolio` et sa variante longue                                 | `/machines`                |
| `/bobineuse-supraconducteur-automachine` et sa copie               | `/machines/bobineuse-esrf` |
| `/contact-automachine`                                             | `/contact`                 |
| `/mentions-legales`                                                | `/mentions-legales`        |
| `/politique-de-confidentialite`                                    | `/confidentialite`         |

Les « variantes longues » sont les adresses de l'ancien site qui répètent le nom de
l'entreprise et son activité dans l'adresse ; elles pointaient sur les mêmes pages.

Choix à confirmer : l'ancien site avait des pages distinctes pour l'équipe, l'histoire, la
politique, les prestations, les moyens et les secteurs. Le nouveau les réunit sur la page
Entreprise, qui reçoit donc toutes ces redirections. Si une de ces pages doit revivre à part,
la ligne correspondante change.
