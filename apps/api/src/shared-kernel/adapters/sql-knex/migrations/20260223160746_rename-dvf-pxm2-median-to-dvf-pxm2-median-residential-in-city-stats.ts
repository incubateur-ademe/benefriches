import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("city_stats", (table) => {
    table.renameColumn("dvf_pxm2_median", "dvf_pxm2_median_residential");
    table.renameColumn("dvf_nbtrans", "dvf_nbtrans_residential");
    table.renameColumn("dvf_surface_median", "dvf_surface_median_residential");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("city_stats", (table) => {
    table.renameColumn("dvf_pxm2_median_residential", "dvf_pxm2_median");
    table.renameColumn("dvf_nbtrans_residential", "dvf_nbtrans");
    table.renameColumn("dvf_surface_median_residential", "dvf_surface_median");
  });
}
