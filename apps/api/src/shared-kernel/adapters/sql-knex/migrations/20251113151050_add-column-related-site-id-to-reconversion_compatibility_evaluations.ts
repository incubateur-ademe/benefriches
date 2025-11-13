import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_compatibility_evaluations", function (table) {
    table.uuid("related_site_id").references("id").inTable("sites");
  });

  await knex.schema.alterTable("reconversion_compatibility_evaluations", (table) => {
    table.jsonb("project_creations").nullable().alter();
  });

  const evaluations = await knex("reconversion_compatibility_evaluations")
    .select()
    .where("status", "=", "has_projects_created");

  let itemsToMigrate = evaluations.length;
  console.log(`${itemsToMigrate} evaluations found`);

  for (const [_, evaluation] of evaluations.entries()) {
    if (!evaluation.project_creations) {
      console.warn(
        `⚠️ Migrate Evaluation ${evaluation.id}: cannot found related project_creations and update relatedSiteId`,
      );
      continue;
    }
    const reconversionProjectId = evaluation.project_creations[0]?.reconversionProjectId;

    await knex.transaction(async (trx) => {
      await trx("reconversion_compatibility_evaluations")
        .update("status", "related_site_created")
        .where("id", evaluation.id);

      if (!reconversionProjectId) {
        console.warn(
          `⚠️ Migrate Evaluation ${evaluation.id}: cannot found related reconversionProjectId and update relatedSiteId`,
        );
        return;
      }

      const reconversionProject = await knex("reconversion_projects")
        .select("related_site_id")
        .where("id", reconversionProjectId)
        .first();

      if (!reconversionProject?.related_site_id) {
        console.warn(
          `⚠️ Migrate Evaluation ${evaluation.id}: cannot found related relatedSiteId and update relatedSiteId`,
        );
        return;
      }

      await trx("reconversion_compatibility_evaluations")
        .update("related_site_id", reconversionProject?.related_site_id)
        .where("id", evaluation.id);

      itemsToMigrate -= 1;
    });
  }
  console.warn(`--> ${itemsToMigrate} evaluations not migrated`);
  console.log(`--> ${evaluations.length - itemsToMigrate} evaluations migrated`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_compatibility_evaluations", function (table) {
    table.dropColumn("related_site_id");
  });

  const evaluations = await knex("reconversion_compatibility_evaluations")
    .select()
    .where("status", "=", "related_site_created");

  for (const [_, evaluation] of evaluations.entries()) {
    await knex.transaction(async (trx) => {
      await trx("reconversion_compatibility_evaluations")
        .update("status", "has_projects_created")
        .where("id", evaluation.id);
    });
  }
}
