Fichiers générés avec [pg-mermaid](https://github.com/bastiensun/pg-mermaid)

## DATABASE

```sh
$ PGPASSWORD=<PG_PASSWORD> npx pg-mermaid -d benefriches_db --username <PG_USERNAME> --output-path docs/db-schema/DATABASE.md
```

## PROJECTS

```sh
$ PGPASSWORD=<PG_PASSWORD> npx pg-mermaid -d benefriches_db --username <PG_USERNAME> --excluded-tables cities carbon_storage knex_migrations knex_migrations_lock users_deprecated sites addresses site_incomes site_expenses site_soils_distributions users --output-path RECONVERSION_PROJECTS.md
```

## SITES

```sh
$ PGPASSWORD=<PG_PASSWORD> npx pg-mermaid -d benefriches_db --username <PG_USERNAME> --excluded-tables cities carbon_storage knex_migrations knex_migrations_lock users_deprecated reconversion_project_development_plans reconversion_project_financial_assistance_revenues reconversion_project_reinstatement_costs reconversion_project_soils_distributions reconversion_project_yearly_expenses reconversion_project_yearly_revenues reconversion_project_development_plan_costs --output-path SITES.md
```

## OTHERS

```sh
$ PGPASSWORD=<PG_PASSWORD> npx pg-mermaid -d benefriches_db --username <PG_USERNAME> --excluded-tables sites addresses site_incomes site_expenses site_soils_distributions reconversion_project_development_plans reconversion_project_financial_assistance_revenues reconversion_project_reinstatement_costs reconversion_project_soils_distributions reconversion_project_yearly_expenses reconversion_project_yearly_revenues reconversion_project_development_plan_costs reconversion_projects  --output-path OTHERS.md
```
