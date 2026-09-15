import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (t) => {
    t.renameColumn("zpc", "aldo_zpc");
    t.renameColumn("code_ser", "aldo_code_ser");
    t.renameColumn("code_groupeser", "aldo_code_groupeser");
    t.renameColumn("code_greco", "aldo_code_greco");
    t.renameColumn("code_bassin_populicole", "aldo_code_bassin_populicole");

    t.string("mte_zonage_abc").nullable();
    t.timestamp("updated_at").nullable();
  });

  await knex.schema.alterTable("cities", (table) => {
    table.string("aldo_zpc").nullable().alter({ alterNullable: true, alterType: false });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.string("aldo_zpc").notNullable().alter({ alterNullable: true, alterType: false });
  });

  await knex.schema.alterTable("cities", (t) => {
    t.renameColumn("aldo_zpc", "zpc");
    t.renameColumn("aldo_code_ser", "code_ser");
    t.renameColumn("aldo_code_groupeser", "code_groupeser");
    t.renameColumn("aldo_code_greco", "code_greco");
    t.renameColumn("aldo_code_bassin_populicole", "code_bassin_populicole");

    t.dropColumn("mte_zonage_abc");
    t.dropColumn("updated_at");
  });
}
