import { configDotenv } from "dotenv";
import knex, { Knex } from "knex";
import path from "node:path";

import { SqlSiteActionsQuery } from "../../../../site-actions/adapters/secondary/site-actions-query/SqlSiteActionsQuery";
import { SqlSiteActionsRepository } from "../../../../site-actions/adapters/secondary/site-actions-repository/SqlSiteActionsRepository";
import { InitializeSiteActionsUseCase } from "../../../../site-actions/core/usecases/initializeSiteActions.usecase";
import { UpdateSiteActionStatusUseCase } from "../../../../site-actions/core/usecases/updateSiteActionStatus.usecase";
import { RealDateProvider } from "../../date/RealDateProvider";
import { RandomUuidGenerator } from "../../id-generator/RandomUuidGenerator";
import knexConfig from "../knexConfig";
import { SqlSite } from "../tableTypes";

const dotEnvPath = path.resolve(process.cwd(), ".env");
configDotenv({ path: dotEnvPath });

// This script initializes site actions for all existing sites in the database.
// It will:
// 1. Create a list of actions (EVALUATE_COMPATIBILITY, EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS, etc.) for each site
// 2. Mark EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS as done if the site has at least one reconversion project
// 3. Mark EVALUATE_COMPATIBILITY as done if the site has a compatibility evaluation

async function initializeSiteActions() {
  const sqlConnection: Knex = knex(knexConfig);

  const dateProvider = new RealDateProvider();
  const uuidGenerator = new RandomUuidGenerator();

  const siteActionsRepository = new SqlSiteActionsRepository(sqlConnection);
  const siteActionsQuery = new SqlSiteActionsQuery(sqlConnection);

  const initializeUseCase = new InitializeSiteActionsUseCase(
    siteActionsRepository,
    siteActionsQuery,
    dateProvider,
    uuidGenerator,
  );

  const updateStatusUseCase = new UpdateSiteActionStatusUseCase(
    siteActionsRepository,
    siteActionsQuery,
    dateProvider,
  );

  try {
    // Get all sites
    const sites = await sqlConnection("sites").select("id");

    console.log(`🔎 Found ${sites.length} site(s) to process`);

    let initializedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;

    for (const site of sites as SqlSite[]) {
      const siteId = site.id;

      // Initialize site actions
      const initResult = await initializeUseCase.execute({
        siteId,
      });

      if (initResult.isFailure()) {
        if (initResult.getError() === "SiteAlreadyInitialized") {
          skippedCount++;
          console.log(`⏭️  Site ${siteId}: already initialized`);
        } else {
          console.error(`❌ Error initializing site ${siteId}: ${initResult.getError()}`);
        }
        continue;
      }

      initializedCount++;
      console.log(`✅ Site ${siteId}: actions initialized`);

      // Check if site has reconversion projects
      const reconversionProjectCount = (await sqlConnection("reconversion_projects")
        .where("related_site_id", siteId)
        .count("* as count")
        .first()) as Record<string, number> | undefined;

      if ((reconversionProjectCount?.count ?? 0) > 0) {
        // Get actions to find the EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS action
        const actions = await siteActionsQuery.getBySiteId(siteId);
        const evaluateReconversionAction = actions.find(
          (action) => action.actionType === "EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS",
        );

        if (evaluateReconversionAction) {
          const updateResult = await updateStatusUseCase.execute({
            siteId,
            actionId: evaluateReconversionAction.id,
            status: "done",
          });

          if (updateResult.isFailure()) {
            console.error(
              `❌ Error updating EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS for site ${siteId}: ${updateResult.getError()}`,
            );
          } else {
            console.log(
              `✅ Site ${siteId}: EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS marked as done`,
            );
            updatedCount++;
          }
        }
      }

      // Check if site has compatibility evaluation
      const compatibilityEvaluation = await sqlConnection("reconversion_compatibility_evaluations")
        .where("related_site_id", siteId)
        .first();

      if (compatibilityEvaluation) {
        // Get actions to find the EVALUATE_COMPATIBILITY action
        const actions = await siteActionsQuery.getBySiteId(siteId);
        const evaluateCompatibilityAction = actions.find(
          (action) => action.actionType === "EVALUATE_COMPATIBILITY",
        );

        if (evaluateCompatibilityAction) {
          const updateResult = await updateStatusUseCase.execute({
            siteId,
            actionId: evaluateCompatibilityAction.id,
            status: "done",
          });

          if (updateResult.isFailure()) {
            console.error(
              `❌ Error updating EVALUATE_COMPATIBILITY for site ${siteId}: ${updateResult.getError()}`,
            );
          } else {
            console.log(`✅ Site ${siteId}: EVALUATE_COMPATIBILITY marked as done`);
            updatedCount++;
          }
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ ${initializedCount} site(s) initialized`);
    console.log(`⏭️  ${skippedCount} site(s) already initialized`);
    console.log(`🔄 ${updatedCount} action(s) updated`);
  } catch (err: unknown) {
    console.error(`❌ Error: ${err as Error}`);
  } finally {
    await sqlConnection.destroy();
    console.log("Database connection closed.");
    console.log("Script finished.");
  }
}

void initializeSiteActions();
