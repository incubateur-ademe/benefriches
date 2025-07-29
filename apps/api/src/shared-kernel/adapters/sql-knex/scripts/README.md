# initialize-or-update-city-stats

Initialisation ou mise à jour des données de la table `city_stats`.

## Dev

```sh
npx ts-node src/shared-kernel/adapters/sql-knex/scripts/initialize-or-update-city-stats.ts
```

## Prod

```sh
scalingo --region osc-secnum-fr1 --app benefriches-api-production run "node apps/api/dist/src/shared-kernel/adapters/sql-knex/scripts/initialize-or-update-city-stats.js"
```

Les données sont issues du fichier [/data/dvf/cityStats.csv](./../../../../../data/dvf/cityStats.csv), généré grâce au script [/data/dvf/build-city-stats.ts](./../../../../../data/dvf/build-city-stats.ts)
