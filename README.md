# Bénéfriches

**Bénéfriches** est un outil numérique développé au sein de [l'incubateur de l'ADEME](https://beta.gouv.fr/incubateurs/ademe.html).

Son object est de fournir une solution de calcul des impacts positifs de la reconversion de friches aux chargés d’opération d’aménagement pour favoriser la prise de décision (pour tout type de projet d’aménagement) et augmenter le nombre de reconversions.

L'outil est actuellement en *phase de construction*.

[Fiche produit](https://beta.gouv.fr/startups/benefriches.html)

[Version démo de l'application](https://benefriches-staging.osc-fr1.scalingo.io)

## Installation et développement

L'application est intégralement codée en Typescript. L'API est construite sur la plateforme NodeJS avec le framework NestJS. L'application web est construite avec les bibliothèques React et Redux.

Les données sont stockées dans une base PostgreSQL.

Le projet est organisé en monorepo et géré avec le gestionnaire de packages `pnpm`.

### Pré-requis
* node (version 20 ou supérieure)
* pnpm (version 8.6 ou supérieur)
* docker (optionnel)
* postgresql (si docker non installé)

### Installation des dépendances
```sh
pnpm install
```

### Lancement et initialisation de la base de données
```sh
docker compose -f docker-compose.db.yml up -d # lancement de la base de données
pnpm --filter api knex:migrate-latest # lancement des migrations
pnpm --filter api knex:seed-run # chargement des données nécessaires à l'application
```

### Création des variables d'environnement
Utilisation des valeurs exposées dans `apps/web/.env.example` et `apps/api/.env.example`.
```sh
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

### Lancement de l'application en mode développement
```sh
pnpm --filter api start:dev
pnpm --filter web setup-env-vars
pnpm --filter web dev
```

## Lancement des tests
```sh
pnpm run -r test
```

## Build, lint et formattage
```sh
pnpm run -r lint
pnpm run -r format:check
pnpm run -r typecheck
pnpm run -r build
```
