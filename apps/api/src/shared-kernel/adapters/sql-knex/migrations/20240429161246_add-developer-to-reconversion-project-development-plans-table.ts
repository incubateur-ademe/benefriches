import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_development_plans", function (table) {
    table.string("developer_name");
    table.string("developer_structure_type");
  });

  const developmentPlans = (await knex
    .from("reconversion_project_development_plans")
    .select(
      "reconversion_projects.future_operator_name",
      "reconversion_projects.future_operator_structure_type",
      "reconversion_project_development_plans.id",
    )
    .innerJoin(
      "reconversion_projects",
      "reconversion_projects.id",
      "=",
      "reconversion_project_development_plans.reconversion_project_id",
    )) as { future_operator_name?: string; future_operator_structure_type?: string; id: string }[];

  if (developmentPlans.length > 0) {
    await Promise.all(
      developmentPlans.map((developmentPlan) => {
        return knex("reconversion_project_development_plans")
          .update({
            developer_name: developmentPlan.future_operator_name,
            developer_structure_type: developmentPlan.future_operator_structure_type,
          })
          .where("id", developmentPlan.id);
      }),
    );
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_development_plans", function (table) {
    table.dropColumn("developer_name");
    table.dropColumn("developer_structure_type");
  });
}
