/* oxlint-disable typescript/prefer-ts-expect-error */
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("users", function (table) {
      table.string("created_from");
    });
    // init existing projects with created_from "features_app"
    // oxlint-disable-next-line typescript/ban-ts-comment
    // @ts-ignore created_from has been removed
    await trx("users").update({ created_from: "features_app" });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("users", function (table) {
    table.dropColumn("created_from");
  });
}
