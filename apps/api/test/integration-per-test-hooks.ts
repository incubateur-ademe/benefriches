import type { Knex } from "knex";
import knex from "knex";
import { afterEach, mock } from "node:test";

import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexConfig";
import { tablesToCleanUp } from "./tablesToCleanUp";

afterEach(async () => {
  mock.restoreAll();

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
