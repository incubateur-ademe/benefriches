import knex, { Knex } from "knex";
import { vi } from "vitest";

import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexConfig";
import { tablesToCleanUp } from "./tablesToCleanUp";

afterEach(async () => {
  vi.restoreAllMocks();

  const sqlConnection: Knex = knex(knexConfig);

  try {
    for (const table of tablesToCleanUp) {
      await sqlConnection(table).del();
    }
  } catch (err) {
    console.error("Error while clearing database in tests", err);
  } finally {
    await sqlConnection.destroy();
  }
});
