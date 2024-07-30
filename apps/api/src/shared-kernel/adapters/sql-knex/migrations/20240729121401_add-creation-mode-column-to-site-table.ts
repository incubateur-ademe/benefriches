import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("sites", function (table) {
      table.string("creation_mode");
    });
    // init existing projects with creationMode "custom"
    await trx("sites").update({ creation_mode: "custom" });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.dropColumn("creation_mode");
  });
}
