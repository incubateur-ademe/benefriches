import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("reconversion_projects", function (table) {
      table.string("creation_mode");
    });
    // init existing projects with creationMode "custom"
    await trx("reconversion_projects").update({ creation_mode: "custom" });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.dropColumn("creation_mode");
  });
}
