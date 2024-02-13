import knex, { Knex } from "knex";
import knexConfig from "../src/shared-kernel/adapters/sql-knex/knexConfig";

global.afterEach(async () => {
  const sqlConnection: Knex = knex(knexConfig);

  const tablesToDelete = [
    "reconversion_project_yearly_expenses",
    "reconversion_project_yearly_revenues",
    "reconversion_project_soils_distributions",
    "reconversion_project_development_plans",
    "reconversion_projects",
    "addresses",
    "site_expenses",
    "site_incomes",
    "site_soils_distributions",
    "sites",
    "users",
  ] as const;

  try {
    for (const table of tablesToDelete) {
      await sqlConnection(table).del();
    }
  } catch (err) {
    console.error("Error while clearing database in tests");
    console.error(err);
  } finally {
    await sqlConnection.destroy();
  }
});
