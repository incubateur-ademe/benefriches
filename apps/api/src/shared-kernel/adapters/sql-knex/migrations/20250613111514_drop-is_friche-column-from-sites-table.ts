import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("sites", (table) => {
    table.dropColumn("is_friche");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", (table) => {
    table.boolean("is_friche").nullable();
  });

  await knex("sites").update({
    // ts-node run by knex doesn't seem to import the tableTypes.d.ts definitions and says ts-expect-error is not useful here
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
    // @ts-ignore is_friche has been dropped
    is_friche: knex.raw(`CASE WHEN nature = 'FRICHE' THEN true ELSE false END`),
  });

  await knex.schema.table("sites", (table) => {
    table.dropNullable("is_friche");
  });
}
