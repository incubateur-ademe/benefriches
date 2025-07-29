import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("city_stats", function (t) {
    t.increments("id").primary();
    t.string("city_code").primary().notNullable();
    t.string("da_name").notNullable();
    t.decimal("da_population", 15).notNullable();
    t.decimal("da_surface_ha", 15).notNullable();
    t.decimal("dvf_nbtrans", 15);
    t.decimal("dvf_pxm2_median", 15);
    t.decimal("dvf_surface_median", 15);
    t.decimal("dvf_nbtrans_cod111", 15);
    t.decimal("dvf_pxm2_median_cod111", 15);
    t.decimal("dvf_surface_median_cod111", 15);
    t.decimal("dvf_nbtrans_cod121", 15);
    t.decimal("dvf_pxm2_median_cod121", 15);
    t.decimal("dvf_surface_median_cod121", 15);
    t.timestamp("updated_at").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("city_stats");
}
