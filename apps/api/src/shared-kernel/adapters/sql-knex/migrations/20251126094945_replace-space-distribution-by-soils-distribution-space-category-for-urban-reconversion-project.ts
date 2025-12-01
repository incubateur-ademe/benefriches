import type { Knex } from "knex";
import {
  LEGACY_SpacesDistribution,
  roundTo2Digits,
  SoilsDistribution,
  sumListWithKey,
  sumObjectValues,
  typedObjectEntries,
} from "shared";
import { v4 as uuid } from "uuid";

import { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";

import { SqlReconversionProjectSoilsDistribution } from "../tableTypes";

const PUBLIC_GREEN_SPACE_TREE_REPLACED_DATE = new Date("2024-07-15");

const checkSpaceDistributionMigration = (
  oldSpaceDistribution: LEGACY_SpacesDistribution,
  newSoilsDistribution: Pick<
    SqlReconversionProjectSoilsDistribution,
    "soil_type" | "space_category" | "surface_area"
  >[],
) => {
  const warnings: string[] = [];
  const oldLivingAndActivitiesSpaces = {
    BUILDINGS_FOOTPRINT: oldSpaceDistribution.BUILDINGS_FOOTPRINT ?? 0,
    PRIVATE_GARDEN_AND_GRASS_ALLEYS: oldSpaceDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0,
    PRIVATE_PAVED_ALLEY_OR_PARKING_LOT:
      oldSpaceDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT ?? 0,
    PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT:
      oldSpaceDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT ?? 0,
  };
  const oldGreenPublicSpaces = {
    PUBLIC_GREEN_SPACES: oldSpaceDistribution.PUBLIC_GREEN_SPACES ?? 0,
    PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS:
      oldSpaceDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
  };

  const oldPublicSpaces = {
    PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS:
      oldSpaceDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
    PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS:
      oldSpaceDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
    PUBLIC_PARKING_LOT: oldSpaceDistribution.PUBLIC_PARKING_LOT ?? 0,
  };

  const oldTotalLivingAndActivitiesSpaces = roundTo2Digits(
    sumObjectValues(oldLivingAndActivitiesSpaces),
  );
  const oldTotalGreenPublicSpaces = roundTo2Digits(sumObjectValues(oldGreenPublicSpaces));
  const oldTotalPublicSpaces = roundTo2Digits(sumObjectValues(oldPublicSpaces));

  const oldTotalSurfaceArea = roundTo2Digits(
    oldTotalLivingAndActivitiesSpaces + oldTotalGreenPublicSpaces + oldTotalPublicSpaces,
  );

  const newLivingAndActivitiesSpaces = newSoilsDistribution.filter(
    ({ space_category }) => space_category === "LIVING_AND_ACTIVITY_SPACE",
  );
  const newGreenPublicSpaces = newSoilsDistribution.filter(
    ({ space_category, soil_type }) =>
      space_category === "PUBLIC_GREEN_SPACE" ||
      (space_category === "PUBLIC_SPACE" && soil_type === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"),
  );
  const newPublicSpaces = newSoilsDistribution.filter(
    ({ space_category, soil_type }) =>
      space_category === "PUBLIC_SPACE" && soil_type !== "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  );

  const newTotalLivingAndActivitiesSpaces = roundTo2Digits(
    sumListWithKey(newLivingAndActivitiesSpaces, "surface_area"),
  );
  const newTotalGreenPublicSpaces = roundTo2Digits(
    sumListWithKey(newGreenPublicSpaces, "surface_area"),
  );
  const newTotalPublicSpaces = roundTo2Digits(sumListWithKey(newPublicSpaces, "surface_area"));

  const newTotalSurfaceArea = roundTo2Digits(sumListWithKey(newSoilsDistribution, "surface_area"));

  if (oldTotalSurfaceArea !== newTotalSurfaceArea) {
    warnings.push(
      `oldTotalSurfaceArea !== newTotalSurfaceArea ${oldTotalSurfaceArea}m2 -> ${newTotalSurfaceArea}m2`,
    );
  }

  if (oldTotalLivingAndActivitiesSpaces !== newTotalLivingAndActivitiesSpaces) {
    warnings.push(
      `oldTotalLivingAndActivitiesSpaces !== newTotalLivingAndActivitiesSpaces ${oldTotalLivingAndActivitiesSpaces}m2 -> ${newTotalLivingAndActivitiesSpaces}m2`,
    );
  }

  if (oldTotalPublicSpaces !== newTotalPublicSpaces) {
    warnings.push(
      `oldTotalPublicSpaces !== newTotalPublicSpaces ${oldTotalPublicSpaces}m2 -> ${newTotalPublicSpaces}m2`,
    );
  }

  if (oldTotalGreenPublicSpaces !== newTotalGreenPublicSpaces) {
    warnings.push(
      `oldTotalGreenPublicSpaces !== newTotalGreenPublicSpaces ${oldTotalGreenPublicSpaces}m2 -> ${newTotalGreenPublicSpaces}m2`,
    );
  }

  return warnings;
};

const getNewProjectSoilsDistribution = (
  spacesDistribution: LEGACY_SpacesDistribution,
): Pick<
  SqlReconversionProjectSoilsDistribution,
  "soil_type" | "space_category" | "surface_area"
>[] => {
  return typedObjectEntries(spacesDistribution).map(([spaceType, surfaceArea = 0]) => {
    switch (spaceType) {
      case "BUILDINGS_FOOTPRINT":
        return {
          surface_area: surfaceArea,
          soil_type: "BUILDINGS",
          space_category: "LIVING_AND_ACTIVITY_SPACE",
        };
      case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
        return {
          surface_area: surfaceArea,
          soil_type: "IMPERMEABLE_SOILS",
          space_category: "LIVING_AND_ACTIVITY_SPACE",
        };
      case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
        return {
          surface_area: surfaceArea,
          soil_type: "MINERAL_SOIL",
          space_category: "LIVING_AND_ACTIVITY_SPACE",
        };
      case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
        return {
          surface_area: surfaceArea,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          space_category: "LIVING_AND_ACTIVITY_SPACE",
        };
      case "PUBLIC_GREEN_SPACES":
        return {
          surface_area: surfaceArea,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          space_category: "PUBLIC_GREEN_SPACE",
        };
      case "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS":
        return {
          surface_area: surfaceArea,
          soil_type: "IMPERMEABLE_SOILS",
          space_category: "PUBLIC_SPACE",
        };
      case "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS":
        return {
          surface_area: surfaceArea,
          soil_type: "MINERAL_SOIL",
          space_category: "PUBLIC_SPACE",
        };
      case "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS":
        return {
          surface_area: surfaceArea,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          space_category: "PUBLIC_SPACE",
        };
      case "PUBLIC_PARKING_LOT":
        return {
          surface_area: surfaceArea,
          soil_type: "IMPERMEABLE_SOILS",
          space_category: "PUBLIC_SPACE",
        };
    }
  });
};

export async function up(knex: Knex): Promise<void> {
  const projects = await knex("reconversion_projects")
    .select(
      "reconversion_projects.id",
      "reconversion_project_development_plans.features",
      "reconversion_projects.created_at",
    )
    .innerJoin(
      "reconversion_project_development_plans",
      "reconversion_projects.id",
      "=",
      "reconversion_project_development_plans.reconversion_project_id",
    )
    .innerJoin(
      "reconversion_project_soils_distributions",
      "reconversion_projects.id",
      "=",
      "reconversion_project_soils_distributions.reconversion_project_id",
    )
    .where("reconversion_project_development_plans.type", "=", "URBAN_PROJECT")
    .where("reconversion_projects.creation_mode", "=", "express")
    .havingRaw("EVERY(reconversion_project_soils_distributions.space_category IS NULL)")
    .groupBy("reconversion_projects.id", "reconversion_project_development_plans.id");

  console.log(`Found ${projects.length} projects to migrate`);

  let errors = [];

  for (const [_, project] of projects.entries()) {
    try {
      console.log(`\nProcess: Project ${project.id}...`);

      const { spacesDistribution, ...restFeatures } = project.features as UrbanProjectFeatures & {
        spacesDistribution: LEGACY_SpacesDistribution;
      };

      if (!spacesDistribution) {
        const error = `⚠️  Project ${project.id}: No spacesDistribution found, skipping`;
        console.warn(error);
        errors.push({
          projectId: project.id,
          error: error,
        });
        return;
      }

      const existingSoilsDistributions = await knex(
        "reconversion_project_soils_distributions",
      ).where("reconversion_project_id", project.id);

      const newDistributions = getNewProjectSoilsDistribution(spacesDistribution);

      const existingDistributionsByType = existingSoilsDistributions.reduce<SoilsDistribution>(
        (result, { soil_type, surface_area = 0 }) => ({
          ...result,
          [soil_type]: (result[soil_type] ?? 0) + surface_area,
        }),
        {},
      );
      const newDistributionsByType = newDistributions.reduce<SoilsDistribution>(
        (result, { soil_type, surface_area = 0 }) => ({
          ...result,
          [soil_type]: (result[soil_type] ?? 0) + surface_area,
        }),
        {},
      );
      const warnings: string[] = typedObjectEntries(existingDistributionsByType).reduce<string[]>(
        (warns, [oldType, oldSurface]) => {
          if (!newDistributionsByType[oldType]) {
            if (
              oldType === "ARTIFICIAL_TREE_FILLED" &&
              project.created_at <= PUBLIC_GREEN_SPACE_TREE_REPLACED_DATE
            ) {
              const oldGreenSoils = roundTo2Digits(
                (existingDistributionsByType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED ?? 0) +
                  (existingDistributionsByType.ARTIFICIAL_TREE_FILLED ?? 0),
              );

              if (oldGreenSoils === newDistributionsByType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED) {
                console.log(
                  `ℹ️ Replace ARTIFICIAL_TREE_FILLED by ARTIFICIAL_GRASS_OR_BUSHES_FILLED for project created before ${PUBLIC_GREEN_SPACE_TREE_REPLACED_DATE.toDateString()}`,
                );
                return warns;
              }
            }
            return [
              ...warns,
              `Type de sol ${oldType} présent dans l'ancienne distribution (${oldSurface}m²) mais absent du nouveau. Vérifier la cohérence des données.`,
            ];
          }

          const newTotal = roundTo2Digits(newDistributionsByType[oldType]);
          if (newTotal !== roundTo2Digits(oldSurface ?? 0)) {
            if (
              oldType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" &&
              project.created_at <= PUBLIC_GREEN_SPACE_TREE_REPLACED_DATE
            ) {
              const oldGreenSoils = roundTo2Digits(
                (existingDistributionsByType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED ?? 0) +
                  (existingDistributionsByType.ARTIFICIAL_TREE_FILLED ?? 0),
              );

              if (oldGreenSoils === newTotal) {
                console.log(
                  `ℹ️ Replace ARTIFICIAL_TREE_FILLED by ARTIFICIAL_GRASS_OR_BUSHES_FILLED for project created before ${PUBLIC_GREEN_SPACE_TREE_REPLACED_DATE.toDateString()}`,
                );
                return warns;
              }
            }
            return [
              ...warns,
              `Type de sol ${oldType} auparavant = ${oldSurface} et maintenant ${newTotal}. Vérifier la cohérence des données.`,
            ];
          }
          return warns;
        },
        [],
      );

      if (warnings.length > 0) {
        console.warn(`--> ⚠️ WRONG newDistributionsByType, skipping`);
        errors.push({
          projectId: project.id,
          error: `WRONG newDistributionsByType \n ${warnings.join("\n--> ⚠️ ")} ${typedObjectEntries(
            newDistributionsByType,
          )
            .map(([key, surface]) => `${key} -> ${surface?.toString()}`)
            .join("\n")} \nvs\n ${typedObjectEntries(existingDistributionsByType)
            .map(([key, surface]) => `${key} -> ${surface?.toString()}`)
            .join("\n")}`,
        });
        continue;
      }

      warnings.push(...checkSpaceDistributionMigration(spacesDistribution, newDistributions));
      if (warnings.length > 0) {
        console.warn(`--> ⚠️ WRONG spaceDistributionMigrations, skipping`);
        errors.push({
          projectId: project.id,
          error: `WRONG spaceDistributionMigrations \n${warnings.join("\n--> ⚠️ ")}\n${typedObjectEntries(
            spacesDistribution,
          )
            .map(([key, surface]) => `    ${key} -> ${surface?.toString()}`)
            .join("\n")} \nvs\n${newDistributions
            .map(
              ({ soil_type, surface_area, space_category }) =>
                `    ${space_category}-${soil_type} -> ${surface_area?.toString()}`,
            )
            .join("\n")}`,
        });
        continue;
      }

      const newFeatures = {
        ...restFeatures,
        spacesDistribution,
        legacySoilsDistribution: existingSoilsDistributions,
      };

      await knex.transaction(async (trx) => {
        await trx("reconversion_project_development_plans")
          .update("features", newFeatures)
          .where("reconversion_project_id", project.id);

        await trx("reconversion_project_soils_distributions")
          .where("reconversion_project_id", project.id)
          .delete();

        await trx("reconversion_project_soils_distributions").insert(
          newDistributions.map(({ soil_type, space_category, surface_area }) => ({
            soil_type,
            space_category,
            surface_area,
            reconversion_project_id: project.id,
            id: uuid(),
          })),
        );
      });
      console.log("--> ✅");
    } catch (error) {
      console.error(`❌ Error migrating project ${project.id}:`, error);
      errors.push({ projectId: project.id, error: `❌ Error migrating project ${project.id}` });
    }
  }

  // 4. Résumé
  console.log("\n📊 Migration Summary:");
  console.log(`  Projects processed: ${projects.length}`);
  console.log(`  Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n❌ Errors:");
    errors.forEach((e) => {
      console.log(`  - PROJECT_ID: ${e.projectId}: ${e.error}`);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const projects = await knex("reconversion_projects")
    .select(
      "reconversion_projects.id",
      "reconversion_project_development_plans.features",
      "reconversion_projects.created_at",
    )
    .innerJoin(
      "reconversion_project_development_plans",
      "reconversion_projects.id",
      "=",
      "reconversion_project_development_plans.reconversion_project_id",
    )
    .innerJoin(
      "reconversion_project_soils_distributions",
      "reconversion_projects.id",
      "=",
      "reconversion_project_soils_distributions.reconversion_project_id",
    )
    .where("reconversion_project_development_plans.type", "=", "URBAN_PROJECT")
    .where("reconversion_projects.creation_mode", "=", "express")
    .whereRaw(
      "reconversion_project_development_plans.features->>'legacySoilsDistribution' IS NOT NULL",
    )
    .groupBy("reconversion_projects.id", "reconversion_project_development_plans.id");

  console.log(`Found ${projects.length} projects to revert`);

  let errors: { projectId: string; error: string }[] = [];

  for (const [_, project] of projects.entries()) {
    try {
      console.log(`\nProcess: Project ${project.id}...`);

      const { legacySoilsDistribution, ...restFeatures } =
        project.features as UrbanProjectFeatures & {
          legacySoilsDistribution?: SqlReconversionProjectSoilsDistribution[];
        };

      if (!legacySoilsDistribution) {
        console.warn(`--> ⚠️ No legacySoilsDistribution found, skipping`);
        errors.push({
          projectId: project.id,
          error: `⚠️  Project ${project.id}: No legacySoilsDistribution found, skipping`,
        });
        return;
      }

      await knex.transaction(async (trx) => {
        await trx("reconversion_project_development_plans")
          .update("features", restFeatures)
          .where("reconversion_project_id", project.id);

        await trx("reconversion_project_soils_distributions")
          .where("reconversion_project_id", project.id)
          .delete();

        await trx("reconversion_project_soils_distributions").insert(legacySoilsDistribution);
      });
      console.log("--> ✅");
    } catch (error: unknown) {
      console.error(`❌ Error reverting project ${project.id}:`, error);
      errors.push({ projectId: project.id, error: `❌ Error reverting project ${project.id}` });
    }
  }

  // 4. Résumé
  console.log("\n📊 Revert Migration Summary:");
  console.log(`  Projects processed: ${projects.length}`);
  console.log(`  Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n❌ Errors:");
    errors.forEach((e) => {
      console.log(`  - PROJECT_ID: ${e.projectId}: ${e.error}`);
    });
  }
}
