import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("city_stats", (table) => {
    table.decimal("dvf_nbtrans_terrain", 15);
    table.decimal("dvf_pxm2_median_terrain", 15);
    table.decimal("dvf_surface_median_terrain", 15);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("city_stats", (table) => {
    table.dropColumn("dvf_nbtrans_terrain");
    table.dropColumn("dvf_pxm2_median_terrain");
    table.dropColumn("dvf_surface_median_terrain");
  });
}
