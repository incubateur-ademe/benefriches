import type { Knex } from "knex";
import { roundTo2Digits, sumListWithKey, typedObjectEntries } from "shared";
import { v4 as uuid } from "uuid";

import type { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";

import type { SqlReconversionProjectSoilsDistribution } from "../tableTypes";

type MigrationResult = {
  migratedSoils: Pick<
    SqlReconversionProjectSoilsDistribution,
    "soil_type" | "space_category" | "surface_area" | "reconversion_project_id"
  >[];
  warnings: string[];
};
type LEGACY_SpacesDistribution = {
  BUILDINGS_FOOTPRINT?: number | undefined;
  PRIVATE_PAVED_ALLEY_OR_PARKING_LOT?: number | undefined;
  PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT?: number | undefined;
  PRIVATE_GARDEN_AND_GRASS_ALLEYS?: number | undefined;
  PUBLIC_GREEN_SPACES?: number | undefined;
  PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS?: number | undefined;
  PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS?: number | undefined;
  PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS?: number | undefined;
  PUBLIC_PARKING_LOT?: number | undefined;
};

const PRIVATE_TREE_REMOVED_DATE = new Date("2025-05-19");

function migrateSoilsDistribution(
  oldSoilsDistribution: SqlReconversionProjectSoilsDistribution[],
  spacesDistribution: LEGACY_SpacesDistribution,
  creationDate: Date,
  reconversionProjectId: string,
): MigrationResult {
  const result: MigrationResult = {
    migratedSoils: [],
    warnings: [],
  };

  const newSoils: MigrationResult["migratedSoils"] = [];
  const trees = oldSoilsDistribution.find(
    ({ soil_type }) => soil_type === "ARTIFICIAL_TREE_FILLED",
  );
  const grass = oldSoilsDistribution.find(
    ({ soil_type }) => soil_type === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  );
  let remainingTrees = trees?.surface_area ?? 0;
  let remainingGrass = grass?.surface_area ?? 0;

  // === LIVING_AND_ACTIVITY_SPACE ===

  // BUILDINGS_FOOTPRINT → BUILDINGS
  if (spacesDistribution.BUILDINGS_FOOTPRINT && spacesDistribution.BUILDINGS_FOOTPRINT > 0) {
    newSoils.push({
      soil_type: "BUILDINGS",
      surface_area: spacesDistribution.BUILDINGS_FOOTPRINT,
      space_category: "LIVING_AND_ACTIVITY_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  // PRIVATE_PAVED_ALLEY_OR_PARKING_LOT → IMPERMEABLE_SOILS
  if (
    spacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT &&
    spacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT > 0
  ) {
    newSoils.push({
      soil_type: "IMPERMEABLE_SOILS",
      surface_area: spacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT,
      space_category: "LIVING_AND_ACTIVITY_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  // PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT → MINERAL_SOIL
  if (
    spacesDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT &&
    spacesDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT > 0
  ) {
    newSoils.push({
      soil_type: "MINERAL_SOIL",
      surface_area: spacesDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT,
      space_category: "LIVING_AND_ACTIVITY_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  // === PUBLIC_SPACE ===

  // PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS → IMPERMEABLE_SOILS
  // Note: cette valeur contient potentiellement des allées pavées de PUBLIC_GREEN_SPACE
  // mais on affecte par défaut à PUBLIC_SPACE
  if (
    spacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS &&
    spacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS > 0
  ) {
    newSoils.push({
      soil_type: "IMPERMEABLE_SOILS",
      surface_area: spacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS,
      space_category: "PUBLIC_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  if (spacesDistribution.PUBLIC_PARKING_LOT && spacesDistribution.PUBLIC_PARKING_LOT > 0) {
    newSoils.push({
      soil_type: "IMPERMEABLE_SOILS",
      surface_area: spacesDistribution.PUBLIC_PARKING_LOT,
      space_category: "PUBLIC_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  // PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS → MINERAL_SOIL
  // Note: cette valeur contient potentiellement des allées gravel de PUBLIC_GREEN_SPACE
  // mais on affecte par défaut à PUBLIC_SPACE
  if (
    spacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS &&
    spacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS > 0
  ) {
    newSoils.push({
      soil_type: "MINERAL_SOIL",
      surface_area: spacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS,
      space_category: "PUBLIC_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  // PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS → ARTIFICIAL_GRASS_OR_BUSHES_FILLED
  if (
    spacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS &&
    spacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS > 0
  ) {
    remainingGrass -= spacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS;
    newSoils.push({
      soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surface_area: spacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS,
      space_category: "PUBLIC_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
  }

  let remainingPrivateGreen = spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0;
  // PRIVATE_GARDEN_AND_GRASS_ALLEYS → ARTIFICIAL_GRASS_OR_BUSHES_FILLED ou ARTIFICIAL_TREE_FILLED
  if (
    spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS &&
    spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS > 0
  ) {
    if (creationDate > PRIVATE_TREE_REMOVED_DATE) {
      remainingPrivateGreen = 0;
      remainingGrass -= spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS;

      newSoils.push({
        soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        surface_area: spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS,
        space_category: "LIVING_AND_ACTIVITY_SPACE",
        reconversion_project_id: reconversionProjectId,
      });
    } else {
      if (remainingTrees && !spacesDistribution.PUBLIC_GREEN_SPACES) {
        remainingPrivateGreen -= remainingTrees;
        newSoils.push({
          soil_type: "ARTIFICIAL_TREE_FILLED",
          surface_area: remainingTrees,
          space_category: "LIVING_AND_ACTIVITY_SPACE",
          reconversion_project_id: reconversionProjectId,
        });
        remainingTrees = 0;
      } else if (
        remainingTrees &&
        spacesDistribution.PUBLIC_GREEN_SPACES &&
        spacesDistribution.PUBLIC_GREEN_SPACES < remainingTrees
      ) {
        if (remainingPrivateGreen >= remainingTrees) {
          remainingPrivateGreen -= remainingTrees;
          newSoils.push({
            soil_type: "ARTIFICIAL_TREE_FILLED",
            surface_area: remainingTrees,
            space_category: "LIVING_AND_ACTIVITY_SPACE",
            reconversion_project_id: reconversionProjectId,
          });
          remainingTrees = 0;
        } else if (remainingPrivateGreen) {
          remainingTrees -= remainingPrivateGreen;
          newSoils.push({
            soil_type: "ARTIFICIAL_TREE_FILLED",
            surface_area: remainingPrivateGreen,
            space_category: "LIVING_AND_ACTIVITY_SPACE",
            reconversion_project_id: reconversionProjectId,
          });
          remainingPrivateGreen = 0;
        }
      } else if (remainingPrivateGreen > 0) {
        if (remainingGrass && remainingGrass - remainingPrivateGreen < 0) {
          remainingPrivateGreen -= remainingGrass;
          newSoils.push({
            soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surface_area: remainingGrass,
            space_category: "LIVING_AND_ACTIVITY_SPACE",
            reconversion_project_id: reconversionProjectId,
          });
          remainingGrass = 0;
        } else {
          remainingGrass -= remainingPrivateGreen;

          newSoils.push({
            soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surface_area: remainingPrivateGreen,
            space_category: "LIVING_AND_ACTIVITY_SPACE",
            reconversion_project_id: reconversionProjectId,
          });
          remainingPrivateGreen = 0;
        }
      }
    }
  }

  // === PUBLIC_GREEN_SPACE ===

  // PUBLIC_GREEN_SPACES est un agrégat qui contient plusieurs types de sols
  // URBAN_POND_OR_LAKE + LAWNS_AND_BUSHES + TREE_FILLED_SPACE
  // On ne peut pas les séparer sans information supplémentaire
  let remainingWater =
    oldSoilsDistribution.find(({ soil_type }) => soil_type === "WATER")?.surface_area ?? 0;

  if (spacesDistribution.PUBLIC_GREEN_SPACES && spacesDistribution.PUBLIC_GREEN_SPACES > 0) {
    // On essaie de déduire la composition à partir de l'ancien soilsDistribution
    const { soils: greenSpacesSoils, ...rest } = deduceGreenSpaceComposition(
      spacesDistribution.PUBLIC_GREEN_SPACES,
      { remainingTrees, remainingGrass, remainingWater },
    );

    newSoils.push(
      ...greenSpacesSoils.map(({ soil_type, space_category, surface_area }) => ({
        soil_type,
        space_category,
        surface_area,
        reconversion_project_id: reconversionProjectId,
      })),
    );

    remainingGrass = rest.remainingGrass;
    remainingTrees = rest.remainingTrees;
    remainingWater = rest.remainingWater;
  }
  if (
    remainingTrees > 0 &&
    remainingPrivateGreen > 0 &&
    remainingPrivateGreen - remainingTrees >= 0
  ) {
    remainingPrivateGreen -= remainingTrees;
    newSoils.push({
      soil_type: "ARTIFICIAL_TREE_FILLED",
      surface_area: remainingTrees,
      space_category: "LIVING_AND_ACTIVITY_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
    remainingTrees = 0;
  } else if (
    remainingTrees > 0 &&
    spacesDistribution.PUBLIC_GREEN_SPACES &&
    spacesDistribution.PUBLIC_GREEN_SPACES - remainingTrees >= 0
  ) {
    newSoils.push({
      soil_type: "ARTIFICIAL_TREE_FILLED",
      surface_area: remainingTrees,
      space_category: "PUBLIC_GREEN_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
    remainingTrees = 0;
  }

  if (
    remainingGrass > 0 &&
    remainingPrivateGreen > 0 &&
    remainingPrivateGreen - remainingGrass >= 0
  ) {
    remainingPrivateGreen -= remainingGrass;
    newSoils.push({
      soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surface_area: remainingGrass,
      space_category: "LIVING_AND_ACTIVITY_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
    remainingGrass = 0;
  }

  if (remainingGrass > 0) {
    newSoils.push({
      soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      surface_area: remainingGrass,
      space_category: "PUBLIC_GREEN_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
    remainingGrass = 0;
  }

  if (remainingWater > 0) {
    newSoils.push({
      soil_type: "WATER",
      surface_area: remainingWater,
      space_category: "LIVING_AND_ACTIVITY_SPACE",
      reconversion_project_id: reconversionProjectId,
    });
    remainingWater = 0;
  }

  // === Vérification de cohérence ===
  const totalNewSurface = newSoils.reduce((sum, s) => sum + s.surface_area, 0);
  const totalOldSurface = oldSoilsDistribution.reduce((sum, s) => sum + s.surface_area, 0);

  if (Math.abs(totalNewSurface - totalOldSurface) > 0.1) {
    result.warnings.push(
      `Différence de surface totale détectée: ancien=${totalOldSurface}m², nouveau=${totalNewSurface}m². ` +
        `Vérifier la cohérence des données.`,
    );
  }

  // Vérifier si des sols de l'ancien distribution sont perdus
  const oldSoilTypes = new Set(oldSoilsDistribution.map((s) => s.soil_type));
  const newSoilTypes = new Set(newSoils.map((s) => s.soil_type));

  oldSoilTypes.forEach((oldType) => {
    if (!newSoilTypes.has(oldType)) {
      const lostSoils = oldSoilsDistribution.filter((s) => s.soil_type === oldType);
      const totalLost = lostSoils.reduce((sum, s) => sum + s.surface_area, 0);
      result.warnings.push(
        `Type de sol ${oldType} présent dans l'ancienne distribution (${totalLost}m²) mais absent du nouveau. ` +
          `Vérifier la cohérence des données.`,
      );
    } else {
      const newTotal = sumListWithKey(
        newSoils.filter(({ soil_type }) => soil_type === oldType),
        "surface_area",
      );
      const oldTotal = oldSoilsDistribution.find(
        ({ soil_type }) => soil_type === oldType,
      )?.surface_area;
      if (roundTo2Digits(newTotal) !== roundTo2Digits(oldTotal ?? 0)) {
        result.warnings.push(
          `Type de sol ${oldType} auparavant = ${oldTotal} et maintenant ${newTotal} ` +
            `Vérifier la cohérence des données.`,
        );
      }
    }
  });

  const newSpaceDistribution = {
    BUILDINGS_FOOTPRINT: sumListWithKey(
      newSoils.filter(({ soil_type }) => soil_type === "BUILDINGS"),
      "surface_area",
    ),
    PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: sumListWithKey(
      newSoils.filter(
        ({ soil_type, space_category }) =>
          soil_type === "IMPERMEABLE_SOILS" && space_category === "LIVING_AND_ACTIVITY_SPACE",
      ),
      "surface_area",
    ),
    PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: sumListWithKey(
      newSoils.filter(
        ({ soil_type, space_category }) =>
          soil_type === "MINERAL_SOIL" && space_category === "LIVING_AND_ACTIVITY_SPACE",
      ),
      "surface_area",
    ),
    PRIVATE_GARDEN_AND_GRASS_ALLEYS: sumListWithKey(
      newSoils.filter(
        ({ soil_type, space_category }) =>
          (soil_type === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" ||
            soil_type === "ARTIFICIAL_TREE_FILLED") &&
          space_category === "LIVING_AND_ACTIVITY_SPACE",
      ),
      "surface_area",
    ),
    PUBLIC_GREEN_SPACES: sumListWithKey(
      newSoils.filter(({ space_category }) => space_category === "PUBLIC_GREEN_SPACE"),
      "surface_area",
    ),
    PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: sumListWithKey(
      newSoils.filter(
        ({ space_category, soil_type }) =>
          soil_type === "IMPERMEABLE_SOILS" && space_category === "PUBLIC_SPACE",
      ),
      "surface_area",
    ),
    PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: sumListWithKey(
      newSoils.filter(
        ({ space_category, soil_type }) =>
          soil_type === "MINERAL_SOIL" && space_category === "PUBLIC_SPACE",
      ),
      "surface_area",
    ),
    PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: sumListWithKey(
      newSoils.filter(
        ({ space_category, soil_type }) =>
          soil_type === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" && space_category === "PUBLIC_SPACE",
      ),
      "surface_area",
    ),
    PUBLIC_PARKING_LOT: undefined,
  };

  if (
    Object.keys(newSpaceDistribution).length === Object.keys(spacesDistribution).length &&
    typedObjectEntries(spacesDistribution).every(
      ([key, surfaceArea]) =>
        key in newSpaceDistribution && newSpaceDistribution[key] === surfaceArea,
    )
  ) {
    result.warnings.push(
      `WRONG newSpaceDistribution \n ${typedObjectEntries(newSpaceDistribution)
        .map(([key, surface]) => `${key} -> ${surface?.toString()}`)
        .join("\n")} \nvs\n ${typedObjectEntries(spacesDistribution)
        .map(([key, surface]) => `${key} -> ${surface?.toString()}`)
        .join("\n")}`,
    );
  }

  result.migratedSoils = newSoils;
  return result;
}

/**
 * Tente de déduire la composition de PUBLIC_GREEN_SPACES à partir de l'ancienne soilsDistribution
 */
type GreenSoil = Pick<
  SqlReconversionProjectSoilsDistribution,
  "soil_type" | "space_category" | "surface_area"
>;
function deduceGreenSpaceComposition(
  publicGreenSpacesTotal: number,
  {
    remainingTrees = 0,
    remainingGrass = 0,
    remainingWater = 0,
  }: { remainingTrees: number; remainingGrass: number; remainingWater: number },
): {
  remainingTrees: number;
  remainingGrass: number;
  remainingWater: number;
  soils: GreenSoil[];
} {
  // Vérifier si ARTIFICIAL_TREE_FILLED correspond exactement à publicGreenSpacesTotal
  if (Math.abs(remainingTrees - publicGreenSpacesTotal) < 0.01 && remainingTrees > 0) {
    return {
      remainingTrees: 0,
      remainingWater,
      remainingGrass,
      soils: [
        {
          soil_type: "ARTIFICIAL_TREE_FILLED",
          surface_area: remainingTrees,
          space_category: "PUBLIC_GREEN_SPACE",
        },
      ],
    };
  }

  if (Math.abs(remainingGrass - publicGreenSpacesTotal) < 0.01 && remainingGrass > 0) {
    return {
      remainingTrees,
      remainingWater,
      remainingGrass: 0,
      soils: [
        {
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: remainingGrass,
          space_category: "PUBLIC_GREEN_SPACE",
        },
      ],
    };
  }

  // Vérifier si ARTIFICIAL_GRASS_OR_BUSHES_FILLED + ARTIFICIAL_TREE_FILLED correspond
  const totalGrassAndTrees = remainingGrass + remainingTrees;

  if (Math.abs(totalGrassAndTrees - publicGreenSpacesTotal) < 0.01 && totalGrassAndTrees > 0) {
    const soils: GreenSoil[] = [];
    if (remainingGrass > 0) {
      soils.push({
        soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        surface_area: remainingGrass,
        space_category: "PUBLIC_GREEN_SPACE",
      });
    }
    if (remainingTrees > 0) {
      soils.push({
        soil_type: "ARTIFICIAL_TREE_FILLED",
        surface_area: remainingTrees,
        space_category: "PUBLIC_GREEN_SPACE",
      });
    }
    return { remainingTrees: 0, remainingWater, remainingGrass: 0, soils };
  }

  const totalWithWater = totalGrassAndTrees + remainingWater;
  if (Math.abs(totalWithWater - publicGreenSpacesTotal) < 0.01 && totalWithWater > 0) {
    const soils: GreenSoil[] = [];
    if (remainingGrass > 0) {
      soils.push({
        soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        surface_area: remainingGrass,
        space_category: "PUBLIC_GREEN_SPACE",
      });
    }
    if (remainingTrees > 0) {
      soils.push({
        soil_type: "ARTIFICIAL_TREE_FILLED",
        surface_area: remainingTrees,
        space_category: "PUBLIC_GREEN_SPACE",
      });
    }
    if (remainingWater > 0) {
      soils.push({
        soil_type: "WATER",
        surface_area: remainingWater,
        space_category: "PUBLIC_GREEN_SPACE",
      });
    }
    return { remainingTrees: 0, remainingWater: 0, remainingGrass: 0, soils };
  }

  return { remainingTrees, remainingWater, remainingGrass, soils: [] };
}

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
    .where("reconversion_projects.creation_mode", "=", "custom")
    .havingRaw("EVERY(reconversion_project_soils_distributions.space_category IS NULL)")
    .groupBy("reconversion_projects.id", "reconversion_project_development_plans.id");

  console.log(`Found ${projects.length} projects to migrate`);

  let errors = [];

  for (const [_, project] of projects.entries()) {
    try {
      console.log(`\nProcess: Project ${project.id}:`);

      const { spacesDistribution, ...restFeatures } = project.features as UrbanProjectFeatures & {
        spacesDistribution: unknown;
      };

      if (!spacesDistribution) {
        console.warn(`⚠️  Project ${project.id}: No spacesDistribution found, skipping`);
        errors.push({
          projectId: project.id,
          error: `⚠️  Project ${project.id}: No spacesDistribution found, skipping`,
        });
        return;
      }

      const existingDistributions = await knex("reconversion_project_soils_distributions").where(
        "reconversion_project_id",
        project.id,
      );

      const existingSoilTypes = existingDistributions.map(({ soil_type }) => soil_type);
      if (new Set(existingSoilTypes).size !== existingSoilTypes.length) {
        const creationDate = new Intl.DateTimeFormat().format(project.created_at);
        console.warn(
          `⚠️  Wrong existingDistributions --> hasDuplicate. Creation date: ${creationDate}`,
        );
        errors.push({
          projectId: project.id,
          error: `⚠️  Wrong existingDistributions --> hasDuplicate. Creation date: ${creationDate}`,
        });
        continue;
      }

      const { warnings, migratedSoils: newDistributions } = migrateSoilsDistribution(
        existingDistributions.slice(),
        { ...spacesDistribution },
        new Date(project.created_at),
        project.id,
      );

      if (warnings.length > 0) {
        console.warn(`⚠️  Project ${project.id} has ${warnings.length} warnings:`);
        warnings.forEach((warning) => {
          console.warn(`  - ${warning}\n`);
        });
        errors.push({
          projectId: project.id,
          error: warnings.reduce((acc, warn) => acc + "\n" + warn, ""),
        });
        continue;
      }

      const newFeatures = {
        ...restFeatures,
        spacesDistribution,
        legacySoilsDistribution: existingDistributions,
      };

      await knex.transaction(async (trx) => {
        await trx("reconversion_project_development_plans")
          .update("features", newFeatures)
          .where("reconversion_project_id", project.id);

        await trx("reconversion_project_soils_distributions")
          .where("reconversion_project_id", project.id)
          .delete();

        await trx("reconversion_project_soils_distributions").insert(
          newDistributions.map(
            ({ soil_type, space_category, surface_area, reconversion_project_id }) => ({
              soil_type,
              space_category,
              surface_area,
              reconversion_project_id,
              id: uuid(),
            }),
          ),
        );
      });
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
    .where("reconversion_projects.creation_mode", "=", "custom")
    .whereRaw(
      "reconversion_project_development_plans.features->>'legacySoilsDistribution' IS NOT NULL",
    )
    .groupBy("reconversion_projects.id", "reconversion_project_development_plans.id");

  console.log(`Found ${projects.length} projects to revert`);

  let errors: { projectId: string; error: string }[] = [];

  for (const [_, project] of projects.entries()) {
    try {
      console.log(`\nProcess: Project ${project.id}:`);

      const { legacySoilsDistribution, ...restFeatures } =
        project.features as UrbanProjectFeatures & {
          legacySoilsDistribution?: SqlReconversionProjectSoilsDistribution[];
        };

      if (!legacySoilsDistribution) {
        console.warn(`⚠️  Project ${project.id}: No legacySoilsDistribution found, skipping`);
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
