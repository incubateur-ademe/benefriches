import type { Knex } from "knex";
import type { BuildingsUse } from "shared";

import type { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";

type LegacyBuildingsUse = "OTHER" | "CULTURAL_PLACE";

const BUILDINGS_USE_MIGRATION_MAP = {
  OTHER: "OTHER_BUILDING",
  CULTURAL_PLACE: "OTHER_CULTURAL_PLACE",
} as const satisfies Record<LegacyBuildingsUse, BuildingsUse>;

const REVERSE_BUILDINGS_USE_MIGRATION_MAP = {
  OTHER_BUILDING: "OTHER",
  OTHER_CULTURAL_PLACE: "CULTURAL_PLACE",
} as const satisfies Partial<Record<BuildingsUse, LegacyBuildingsUse>>;

export async function up(knex: Knex): Promise<void> {
  const rows = await knex("reconversion_project_development_plans")
    .select("id", "features")
    .whereRaw(`features::json->'buildingsFloorAreaDistribution' IS NOT NULL`);

  for (const row of rows) {
    const features = row.features as UrbanProjectFeatures;
    const updatedDistribution: Record<string, number> = {};

    for (const [key, value] of Object.entries(features.buildingsFloorAreaDistribution)) {
      if (!(key in BUILDINGS_USE_MIGRATION_MAP)) {
        updatedDistribution[key] = value;
      } else {
        const newKey = BUILDINGS_USE_MIGRATION_MAP[key as keyof typeof BUILDINGS_USE_MIGRATION_MAP];
        const newValue = (updatedDistribution[newKey] ?? 0) + value;
        updatedDistribution[newKey] = newValue;
      }
    }

    const updatedFeatures = {
      ...features,
      buildingsFloorAreaDistribution: updatedDistribution,
    };

    await knex("reconversion_project_development_plans")
      .update({ features: updatedFeatures })
      .where({ id: row.id });
  }
}

export async function down(knex: Knex): Promise<void> {
  const rows = await knex("reconversion_project_development_plans")
    .select("id", "features")
    .whereRaw(`features::json->'buildingsFloorAreaDistribution' IS NOT NULL`);

  for (const row of rows) {
    const features = row.features as UrbanProjectFeatures;
    const updatedDistribution: Record<string, number> = {};

    for (const [key, value] of Object.entries(features.buildingsFloorAreaDistribution)) {
      if (!(key in REVERSE_BUILDINGS_USE_MIGRATION_MAP)) {
        updatedDistribution[key] = value;
      } else {
        const newKey =
          REVERSE_BUILDINGS_USE_MIGRATION_MAP[
            key as keyof typeof REVERSE_BUILDINGS_USE_MIGRATION_MAP
          ];
        const newValue = (updatedDistribution[newKey] ?? 0) + value;
        updatedDistribution[newKey] = newValue;
      }
    }

    const updatedFeatures = {
      ...features,
      buildingsFloorAreaDistribution: updatedDistribution,
    };

    await knex("reconversion_project_development_plans")
      .update({ features: updatedFeatures })
      .where({ id: row.id });
  }
}
