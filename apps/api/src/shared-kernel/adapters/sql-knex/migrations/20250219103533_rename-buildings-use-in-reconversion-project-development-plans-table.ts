import type { Knex } from "knex";
import { BuildingsUse } from "shared";

import { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";

type LegacyBuildingsUse =
  | "GROUND_FLOOR_RETAIL"
  | "NEIGHBOURHOOD_FACILITIES_AND_SERVICES"
  | "SHIPPING_OR_INDUSTRIAL_BUILDINGS"
  | "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS"
  | "TERTIARY_ACTIVITIES"
  | "SOCIO_CULTURAL_PLACE";

const BUILDINGS_USE_MIGRATION_MAP = {
  GROUND_FLOOR_RETAIL: "LOCAL_STORE",
  NEIGHBOURHOOD_FACILITIES_AND_SERVICES: "LOCAL_SERVICES",
  SHIPPING_OR_INDUSTRIAL_BUILDINGS: "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
  OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
  TERTIARY_ACTIVITIES: "OFFICES",
  SOCIO_CULTURAL_PLACE: "CULTURAL_PLACE",
} as const satisfies Record<LegacyBuildingsUse, BuildingsUse>;

const REVERSE_BUILDINGS_USE_MIGRATION_MAP = {
  LOCAL_STORE: "GROUND_FLOOR_RETAIL",
  LOCAL_SERVICES: "NEIGHBOURHOOD_FACILITIES_AND_SERVICES",
  ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
  OFFICES: "TERTIARY_ACTIVITIES",
  CULTURAL_PLACE: "SOCIO_CULTURAL_PLACE",
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

    // Update the features object with the transformed buildingsFloorAreaDistribution field
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
