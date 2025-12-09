# Bénéfriches

**Bénéfriches** est un outil numérique développé au sein de [l'incubateur de l'ADEME](https://beta.gouv.fr/incubateurs/ademe.html).

Son objectif est de fournir une solution de calcul des impacts positifs de la reconversion de friches aux chargés d’opération d’aménagement pour favoriser la prise de décision (pour tout type de projet d’aménagement) et augmenter le nombre de reconversions.

L'outil est actuellement en *phase de construction*.

[Fiche produit](https://beta.gouv.fr/startups/benefriches.html)

[Version démo de l'application](https://benefriches.incubateur.ademe.dev/)

## Installation et développement

L'application est intégralement codée en Typescript. L'API est construite sur la plateforme NodeJS avec le framework NestJS. L'application web est construite avec les bibliothèques React et Redux.

Les données sont stockées dans une base PostgreSQL.

Le projet est organisé en monorepo et géré avec le gestionnaire de packages `pnpm`.

Le code commun au front-end et au back-end (types, fonctions de calculs, etc.) est placé dans le package `shared`.

### Pré-requis
* node (version 24 ou supérieure)
* pnpm (version 10.24.0 ou supérieure)
* docker (optionnel)
* postgresql (si docker non installé)

### Installation des dépendances
```sh
pnpm install
```

### Création des variables d'environnement
- Utilisation des valeurs exposées dans `apps/web/.env.example` et `apps/api/.env.example`.
```sh
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

- Modifier les valeurs de `DATABASE_USER` et `DATABASE_PASSWORD` en fonction de la méthode choisie pour lancer la base de données.
Pour docker, utiliser `DATABASE_USER`=`postgres` et `DATABASE_PASSWORD`=`secret`.

### Lancement de la base de données

#### avec Docker
```sh
# à la racine du projet
$ docker compose --env-file apps/api/.env -f docker-compose.db.yml up -d
```

#### avec PostgreSQL

Lancer PostgreSQL et créer l’utilisateur et la base de données :
```sh
postgres=\# CREATE USER <USERNAME> WITH ENCRYPTED PASSWORD '<YOUR_PASSWORD>';
postgres=\# CREATE DATABASE benefriches_db WITH OWNER = claire;
```

### Initialisation de la base de données

```sh
pnpm --filter api knex:migrate-latest # lancement des migrations
pnpm --filter api knex:seed-run # chargement des données nécessaires à l'application
```

### Lancement de l'application en mode développement
```sh
pnpm --filter api start:dev
pnpm --filter web setup-env-vars
pnpm --filter web dev
```

### Stack Docker production-like

La stack complète peut être lancée via Docker Compose dans un environnement similaire à la production (tests manuels, debugging, etc.).

```sh
# Démarrer la stack (postgres, api, web, mailcatcher)
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up -d

# Arrêter la stack
docker compose --env-file .env.e2e -f docker-compose.e2e.yml down
```

Services disponibles (configuration par défaut dans `.env.e2e`) :
- Application web : `http://localhost:3001`
- API : `http://localhost:4001`
- Mailcatcher (emails envoyés par l'API) : `http://localhost:1080`

## Lancement des tests

### Tests unitaires et d'intégration
```sh
pnpm run -r test
```

### Tests end-to-end (E2E)

Les tests E2E utilisent la stack Docker production-like.

```sh
# Démarrer la stack Docker
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up -d

# Installer les navigateurs Playwright (première fois uniquement)
pnpm --filter e2e-tests exec playwright install --with-deps

# Lancer les tests
pnpm --filter e2e-tests test:headed

# Arrêter la stack
docker compose --env-file .env.e2e -f docker-compose.e2e.yml down
```

## Build, lint et formattage
```sh
pnpm run -r lint
pnpm run -r format:check
pnpm run -r typecheck
pnpm run -r build
```
