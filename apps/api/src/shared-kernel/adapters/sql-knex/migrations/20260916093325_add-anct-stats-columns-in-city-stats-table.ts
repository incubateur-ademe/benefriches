import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("city_stats", (t) => {
    t.decimal("anct_taux_annuel_evol_population_2016_2022", 15);
    t.decimal("anct_part_actifs_transports_en_commun_2022", 15);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("city_stats", (t) => {
    t.dropColumn("anct_taux_annuel_evol_population_2016_2022");
    t.dropColumn("anct_part_actifs_transports_en_commun_2022");
  });
}
