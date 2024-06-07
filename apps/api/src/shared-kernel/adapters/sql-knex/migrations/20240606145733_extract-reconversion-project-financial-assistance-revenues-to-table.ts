import type { Knex } from "knex";
import { v4 as uuid } from "uuid";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // create reconversion_project_financial_assistance_revenues table
    await trx.schema.createTable(
      "reconversion_project_financial_assistance_revenues",
      function (table) {
        table.uuid("id").unique().primary().notNullable();
        table.string("source").notNullable();
        table.decimal("amount", 15, 2);
        table
          .uuid("reconversion_project_id")
          .references("id")
          .inTable("reconversion_projects")
          .notNullable();
      },
    );

    // retrieve all non-null, non-zero financial assistance revenues in reconversion_projects
    const result = (await trx("reconversion_projects")
      .select("id", "financial_assistance_revenues")
      .whereNotNull("financial_assistance_revenues")
      .where("financial_assistance_revenues", ">", 0)) as {
      id: string;
      financial_assistance_revenues: number;
    }[];

    // insert in created reconversion_project_financial_assistance_revenues table
    const financialAssistanceRevenuesToInsert = result.map(
      ({ id, financial_assistance_revenues }) => {
        return {
          id: uuid(),
          source: "other_financial_assistance_revenuess",
          amount: financial_assistance_revenues,
          reconversion_project_id: id,
        };
      },
    );
    if (financialAssistanceRevenuesToInsert.length > 0)
      await trx("reconversion_project_financial_assistance_revenues").insert(
        financialAssistanceRevenuesToInsert,
      );

    // delete financial_assistance_revenues column from reconversion_projects table
    await trx.schema.table("reconversion_projects", function (table) {
      table.dropColumn("financial_assistance_revenues");
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("reconversion_projects", function (table) {
      table.decimal("financial_assistance_revenues", 15, 2);
    });

    // delete reconversion_project_financial_assistance_revenues table
    await trx.schema.dropTableIfExists("reconversion_project_financial_assistance_revenues");
  });
}
