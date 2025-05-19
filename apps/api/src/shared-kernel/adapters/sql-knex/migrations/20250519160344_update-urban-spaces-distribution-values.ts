import type { Knex } from "knex";

import { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";

export async function up(knex: Knex): Promise<void> {
  const rows = await knex("reconversion_project_development_plans")
    .select("id", "features")
    .where({ type: "URBAN_PROJECT" })
    .whereRaw(`features::json->'spacesDistribution' IS NOT NULL`);

  for (const row of rows) {
    const features = row.features as UrbanProjectFeatures;

    // @ts-expect-error has been removed from type
    if (!features.spacesDistribution.PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS) continue;

    console.log("Will update spaces distribution");
    console.log("Before update", features.spacesDistribution);

    const updatedDistribution: Record<string, number> = features.spacesDistribution;

    updatedDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS =
      (features.spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0) +
      // @ts-expect-error has been removed
      (features.spacesDistribution.PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS as number);

    delete updatedDistribution.PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS;

    const updatedFeatures = {
      ...features,
      spacesDistribution: updatedDistribution,
    };

    console.log("After update", updatedFeatures.spacesDistribution);

    await knex("reconversion_project_development_plans")
      .update({ features: updatedFeatures })
      .where({ id: row.id });
  }
}

export function down(): void {
  return;
}
