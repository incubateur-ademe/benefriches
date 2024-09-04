import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("reconversion_projects", function (table) {
      table.decimal("friche_decontaminated_soil_surface_area", 12, 2);
    });

    const reconversionProjects = (await knex
      .from("reconversion_projects")
      .select(
        "sites.friche_contaminated_soil_surface_area",
        "reconversion_projects.id",
        "reconversion_projects.creation_mode",
      )
      .innerJoin("sites", "reconversion_projects.related_site_id", "=", "sites.id")
      .where("sites.is_friche", true)
      .whereNotNull("sites.friche_contaminated_soil_surface_area")) as {
      surface_area: number;
      friche_contaminated_soil_surface_area?: number;
      id: string;
      creation_mode: "express" | "custom";
    }[];

    if (reconversionProjects.length > 0) {
      await Promise.all(
        reconversionProjects.map((reconversionProject) => {
          const defaultDecontaminationCoefficient =
            reconversionProject.creation_mode === "express" ? 0.75 : 1;
          return knex("reconversion_projects")
            .update({
              friche_decontaminated_soil_surface_area:
                defaultDecontaminationCoefficient *
                (reconversionProject.friche_contaminated_soil_surface_area ?? 0),
            })
            .where("id", reconversionProject.id);
        }),
      );
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.dropColumn("friche_decontaminated_soil_surface_area");
  });
}
