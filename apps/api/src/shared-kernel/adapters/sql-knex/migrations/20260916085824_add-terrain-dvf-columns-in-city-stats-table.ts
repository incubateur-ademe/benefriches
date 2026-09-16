import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("city_stats", (t) => {
    t.decimal("dvf_nbtrans_terrain", 15);
    t.decimal("dvf_pxm2_median_terrain", 15);
    t.decimal("dvf_surface_median_terrain", 15);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("city_stats", (t) => {
    t.dropColumn("dvf_nbtrans_terrain");
    t.dropColumn("dvf_pxm2_median_terrain");
    t.dropColumn("dvf_surface_median_terrain");
  });
}
