import knex, { Knex } from "knex";
import fs from "node:fs";
import path from "node:path";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { tablesToCleanUp } from "../../../../test/tablesToCleanUp";

// Tables excluded from consistency checks:
// - Knex system tables (managed by Knex, not application code)
// - Seed/reference data tables (read-only, seeded at startup, never written to by tests)
// - Legacy tables (kept for data preservation, not used by application code)
const TABLES_EXCLUDED_FROM_CONSISTENCY_CHECKS = new Set([
  "knex_migrations",
  "knex_migrations_lock",
  "carbon_storage",
  "cities",
  "city_stats",
  "users_deprecated",
]);

describe("Database table consistency", () => {
  let sqlConnection: Knex;
  let dbTables: string[];

  beforeAll(async () => {
    sqlConnection = knex(knexConfig);
    const result = await sqlConnection
      .select("table_name")
      .from("information_schema.tables")
      .where({ table_schema: "public" });
    dbTables = result
      .map((row: { table_name: string }) => row.table_name)
      .filter((name: string) => !TABLES_EXCLUDED_FROM_CONSISTENCY_CHECKS.has(name))
      .toSorted();
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  it("all tables should be listed in integration test cleanup hook", () => {
    const missing = dbTables.filter(
      (table) => !tablesToCleanUp.includes(table as (typeof tablesToCleanUp)[number]),
    );
    expect(
      missing,
      `Tables missing from test/tablesToCleanUp.ts — add them to ensure test isolation: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("all tables should have type declarations in tableTypes.d.ts", () => {
    const typesPath = path.join(
      process.cwd(),
      "src",
      "shared-kernel",
      "adapters",
      "sql-knex",
      "tableTypes.d.ts",
    );
    const content = fs.readFileSync(typesPath, "utf-8");

    // Match table declarations at 4-space indentation inside the Tables interface.
    // This avoids matching properties of inline type definitions (which are at 6+ spaces).
    const tablesSection = content.slice(content.indexOf("interface Tables {"));
    const declaredTables = new Set(
      [...tablesSection.matchAll(/^    (\w+)\s*:/gm)].map((m) => m[1]),
    );

    const missing = dbTables.filter((table) => !declaredTables.has(table));
    expect(
      missing,
      `Tables missing from tableTypes.d.ts Tables interface — add type declarations: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
