// oxlint-disable no-console
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const userId = process.argv[2];

if (!userId) {
  console.error(
    "Usage: pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/delete-ademe-user-data.ts <user-id>",
  );
  console.error("\nExample:");
  console.error(
    '  pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/delete-ademe-user-data.ts "user-123"',
  );
  process.exit(1);
}

// oxlint-disable-next-line typescript/no-floating-promises
(async () => {
  console.info("Connecting to database...");
  const db = knex(knexConfig);

  try {
    const sitesCountResult = await db("sites")
      .where({ created_by: userId })
      .count<{ count: string }[]>("id as count");
    const sitesCount = sitesCountResult[0]?.count ?? "0";

    const reconversionProjectsCountResult = await db("reconversion_projects")
      .where({ created_by: userId })
      .count<{ count: string }[]>("id as count");
    const reconversionProjectsCount = reconversionProjectsCountResult[0]?.count ?? "0";

    console.info(
      `About to delete ${sitesCount} site(s) and ${reconversionProjectsCount} reconversion project(s) for user ${userId}`,
    );

    await db.transaction(async (trx) => {
      const reconversionProjectIds = trx("reconversion_projects")
        .where({ created_by: userId })
        .select("id");

      const developmentPlanIds = trx("reconversion_project_development_plans")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .select("id");

      await trx("reconversion_project_soils_distributions")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .delete();

      await trx("reconversion_project_development_plan_costs")
        .whereIn("development_plan_id", developmentPlanIds)
        .delete();

      await trx("reconversion_project_development_plans")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .delete();

      await trx("reconversion_project_yearly_expenses")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .delete();

      await trx("reconversion_project_yearly_revenues")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .delete();

      await trx("reconversion_project_reinstatement_costs")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .delete();

      await trx("reconversion_project_financial_assistance_revenues")
        .whereIn("reconversion_project_id", reconversionProjectIds.clone())
        .delete();

      await trx("reconversion_projects").where({ created_by: userId }).delete();

      const siteIds = trx("sites").where({ created_by: userId }).select("id");

      await trx("addresses").whereIn("site_id", siteIds.clone()).delete();
      await trx("site_soils_distributions").whereIn("site_id", siteIds.clone()).delete();
      await trx("site_expenses").whereIn("site_id", siteIds.clone()).delete();
      await trx("site_incomes").whereIn("site_id", siteIds.clone()).delete();
      await trx("site_urban_zone_features").whereIn("site_id", siteIds.clone()).delete();
      await trx("site_actions").whereIn("site_id", siteIds.clone()).delete();

      await trx("sites").where({ created_by: userId }).delete();
    });

    console.info(
      `✅ Deleted ${sitesCount} site(s) and ${reconversionProjectsCount} reconversion project(s).`,
    );
    // oxlint-disable-next-line no-explicit-any
  } catch (error: any) {
    process.exitCode = 1;
    console.error("Fatal error:", error);
    if (error.errors) {
      console.error(error.errors);
    }
  } finally {
    console.error("Destroying database connection...");
    await db.destroy();
  }
})();
