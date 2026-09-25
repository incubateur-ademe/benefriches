---
paths:
  - "apps/api/src/**/core/gateways/*Query.ts"
  - "apps/api/src/**/core/gateways/*Repository.ts"
  - "apps/api/src/**/Sql*Query.ts"
  - "apps/api/src/**/Sql*Repository.ts"
  - "apps/api/src/**/InMemory*Query.ts"
  - "apps/api/src/**/InMemory*Repository.ts"
  - "apps/api/src/**/Sql*.integration-spec.ts"
---

# API persistence: queries and repositories

## Query or repository

- Choose by what the use case does. A `*Query` serves use cases that only read, to display something, and never writes. A `*Repository` serves use cases that write, and may read what the write needs (existence, ownership, current state). Don't add a write to a query, or a display read to a repository.
- Each gateway has a `Sql*` and an `InMemory*` implementation side by side: [SitesQuery.ts](../../../apps/api/src/sites/core/gateways/SitesQuery.ts) → [SqlSitesQuery.ts](../../../apps/api/src/sites/adapters/secondary/site-query/SqlSitesQuery.ts), [InMemorySitesQuery.ts](../../../apps/api/src/sites/adapters/secondary/site-query/InMemorySitesQuery.ts); [SitesRepository.ts](../../../apps/api/src/sites/core/gateways/SitesRepository.ts) → [SqlSiteRepository.ts](../../../apps/api/src/sites/adapters/secondary/site-repository/SqlSiteRepository.ts), [InMemorySitesRepository.ts](../../../apps/api/src/sites/adapters/secondary/site-repository/InMemorySitesRepository.ts).
- Queries return view types from `core/models/` shaped for the screen, often an alias of the shared response DTO (`SiteFeaturesView` in [views.ts](../../../apps/api/src/sites/core/models/views.ts)). Repositories take and return domain entities (`SiteEntity`).

## SQL implementations

- The Knex connection is injected with `@Inject(SqlConnection)`; the token comes from [sqlConnection.module.ts](../../../apps/api/src/shared-kernel/adapters/sql-knex/sqlConnection.module.ts).
- Knex is typed through the `Tables` interface in [tableTypes.d.ts](../../../apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts), so `this.sqlConnection("sites")` is typed from the table name. Rows are snake_case: map them to camelCase explicitly in the adapter.
- A write that touches several tables runs in `this.sqlConnection.transaction(async (trx) => …)`, and every statement inside uses `trx`, not `this.sqlConnection`: `save()` in SqlSiteRepository.ts.
- `json_agg` / `jsonb_agg` over zero rows returns `NULL`, not `[]`. Drop the NULL row a LEFT JOIN produces with `FILTER (WHERE child.id IS NOT NULL)`, then either `COALESCE(…, '[]'::json)` in SQL or type the field `| null` and default it with `?? []` (SqlSitesQuery.ts, [SqlSiteEvaluationQuery.ts](../../../apps/api/src/site-evaluations/adapters/secondary/queries/SqlSiteEvaluationQuery.ts)).
- Top-level timestamp columns come back as `Date`, but timestamps nested in `json_build_object` / `row_to_json` come back as strings: type them `string` in the row type and convert them, like `mapSqlSchedule` in [SqlReconversionProjectQuery.ts](../../../apps/api/src/reconversion-projects/adapters/secondary/queries/reconversion-project-features/SqlReconversionProjectQuery.ts).
- `COUNT(*)` and other int8/`bigint` results come back from `pg` as strings ([knexConfig.ts](../../../apps/api/src/shared-kernel/adapters/sql-knex/knexConfig.ts) only parses `NUMERIC`); cast in SQL (`COUNT(*)::int`), as in [SqlSiteEvaluationQuery.ts](../../../apps/api/src/site-evaluations/adapters/secondary/queries/SqlSiteEvaluationQuery.ts).

## InMemory implementations

- Keep state in plain arrays or maps. Test-only helpers start with `_` (`_setSites`, `_getSites` in InMemorySitesRepository.ts) so they don't read as part of the gateway contract.
