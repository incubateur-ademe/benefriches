# initialize-or-update-city-stats.ts

```sh
npx ts-node src/shared-kernel/adapters/sql-knex/scripts/initialize-or-update-city-stats.ts
```

Initialisation ou mise à jour des données de la table `city_stats`.

Les données sont issues du fichier [/data/dvf/cityStats.csv](./../../../../../data/dvf/cityStats.csv), généré grâce au script [/data/dvf/build-city-stats.ts](./../../../../../data/dvf/build-city-stats.ts)
