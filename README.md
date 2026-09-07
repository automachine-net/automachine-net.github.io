# automachine.net

Site d'Automachine, concepteur et fabricant de machines spéciales à Tours. Site statique en
Astro, contenu en Markdown et JSON dans ce dépôt, édité avec Sveltia CMS, construit et publié
par GitHub Actions.

## Par où entrer

| Vous voulez…                                    | Lisez                                      |
| ----------------------------------------------- | ------------------------------------------ |
| modifier un texte, une page, une machine        | [docs/EDITION.md](docs/EDITION.md)         |
| reprendre le code, ajouter un bloc ou un module | [docs/REPRISE.md](docs/REPRISE.md)         |
| comprendre le déploiement                       | [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md) |
| préparer un rendu ou un modèle 3D               | [docs/3D.md](docs/3D.md)                   |
| basculer sur le domaine définitif               | [docs/BASCULE.md](docs/BASCULE.md)         |
| connaître les décisions prises et pourquoi      | [CLAUDE.md](CLAUDE.md)                     |

## En deux commandes

```bash
npm install
npm run dev
```

`npm run build` construit le site dans `dist/`, après vérification des types et détourage des
rendus. Les autres commandes sont décrites dans `docs/REPRISE.md`.

## Ce qui ne doit pas changer

Le contenu vit dans des fichiers texte du dépôt, jamais dans une base de données. Aucun
service tiers ne tourne chez le visiteur. Tant que ce dépôt est public, il ne contient ni
secret ni adresse électronique.
