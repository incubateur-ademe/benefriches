# Scripts de maintenance

## initialize-site-actions

Initialise les actions affichées dans "suivi du site" pour tous les sites existants dans la base de données.

Ce script :

1. Crée une liste d'actions pour chaque site (EVALUATE_COMPATIBILITY, EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS, etc.)
2. Marque EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS comme "done" si le site a au moins un projet de reconversion
3. Marque EVALUATE_COMPATIBILITY comme "done" si le site a une évaluation de compatibilité

### Dev

```sh
npx tsx src/shared-kernel/adapters/sql-knex/scripts/initialize-site-actions.ts
```

---

## initialize-or-update-city-stats

Initialisation ou mise à jour des données de la table `city_stats`.

### Dev

```sh
npx ts-node src/shared-kernel/adapters/sql-knex/scripts/initialize-or-update-city-stats.ts
```

### Prod

```sh
scalingo --region osc-secnum-fr1 --app benefriches-api-production run "node apps/api/dist/src/shared-kernel/adapters/sql-knex/scripts/initialize-or-update-city-stats.js"
```

Les données sont issues du fichier [/data/dvf/cityStats.csv](./../../../../../data/dvf/cityStats.csv), généré grâce au script [/data/dvf/build-city-stats.ts](./../../../../../data/dvf/build-city-stats.ts)
