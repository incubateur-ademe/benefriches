---
paths:
  - "apps/api/src/shared-kernel/adapters/sql-knex/migrations/*.ts"
  - "apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts"
---

# Database migrations

- Create a migration and update `tableTypes.d.ts` with the [`/create-database-migration` skill](../../../.agents/skills/create-database-migration/SKILL.md) (script: `pnpm --filter api knex:new-migration <name>`).
- A new table must be declared in the `Tables` interface of `tableTypes.d.ts` and listed in [`test/tablesToCleanUp.ts`](../../../apps/api/test/tablesToCleanUp.ts): [`tableConsistency.integration-spec.ts`](../../../apps/api/src/shared-kernel/adapters/sql-knex/tableConsistency.integration-spec.ts) fails until both are done.
- Don't edit a migration that is already on `main`: Scalingo runs pending migrations after each deploy ([Procfile](../../../apps/api/scalingo/Procfile) `postdeploy`), so staging has applied it. Add a new migration instead.
