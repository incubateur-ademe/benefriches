import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlCarbonStorageQuery } from "./SqlCarbonStorageQuery";

describe("SqlCarbonStorageQuery integration", () => {
  let sqlConnection: Knex;
  let sqlCarbonStorageQuery: SqlCarbonStorageQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    sqlCarbonStorageQuery = new SqlCarbonStorageQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("throws error if no city code is provided", async () => {
    await assert.rejects(() => sqlCarbonStorageQuery.getCarbonStorageForCity("1234", []));
  });

  it("returns values for all soil categories if no category is provided", async () => {
    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01027", []);
    const soilStorageValues = result.filter(({ reservoir }) => reservoir === "soil");
    assert.strictEqual(soilStorageValues.length, 15);

    const nonForestBiomassStorageValues = result.filter(
      ({ reservoir }) => reservoir === "non_forest_biomass",
    );
    assert.strictEqual(nonForestBiomassStorageValues.length, 6);

    const deadForestBiomassStorageValues = result.filter(
      ({ reservoir }) => reservoir === "dead_forest_biomass",
    );
    assert.strictEqual(deadForestBiomassStorageValues.length, 4);

    const liveForestBiomassStorageValues = result.filter(
      ({ reservoir }) => reservoir === "live_forest_biomass",
    );
    assert.strictEqual(liveForestBiomassStorageValues.length, 4);

    const litterForestStorageValues = result.filter(({ reservoir }) => reservoir === "litter");
    assert.strictEqual(litterForestStorageValues.length, 4);
  });

  it("Gets carbon storage entries for a city and specific soils for a simple case", async () => {
    const soilCategories = ["artificial_tree_filled", "forest_deciduous"] as const;

    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01027", [
      ...soilCategories,
    ]);

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "soil" && soilCategory === "forest_deciduous",
    );

    assert.strictEqual(carbonStorageInSoilForForest.length, 1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "soil" && soilCategory === "artificial_tree_filled",
    );

    // RESERVOIR NON FOREST BIOMASS
    assert.strictEqual(carbonStorageInSoilForArtificialTreeFilled.length, 1);

    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "non_forest_biomass" && soilCategory === "artificial_tree_filled",
    );

    // RESERVOIR FOREST BIOMASS
    assert.strictEqual(carbonStorageInNonForestBiomassForArtificialTreeFilled.length, 1);

    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "dead_forest_biomass" && soilCategory === "forest_deciduous",
    );

    assert.strictEqual(carbonStorageInDeadForestBiomassForForest.length, 1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "live_forest_biomass" && soilCategory === "forest_deciduous",
    );

    assert.strictEqual(carbonStorageInLiveForestBiomassForForest.length, 1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "litter" && soilCategory === "forest_deciduous",
    );

    // RESERVOIR FOREST LITTER
    assert.strictEqual(carbonStorageInLitterForForest.length, 1);

    assert.strictEqual(result.length, 6);
  });

  it("Gets carbon storage entries for a city and specific soils for a city with no information on forest", async () => {
    const soilCategories = [
      "artificial_tree_filled",
      "forest_conifer",
      "prairie_bushes",
      "water",
      "wet_land",
    ] as const;

    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01026", [
      ...soilCategories,
    ]);

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "soil" && soilCategory === "forest_conifer",
    );

    assert.strictEqual(carbonStorageInSoilForForest.length, 1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "soil" && soilCategory === "artificial_tree_filled",
    );

    assert.strictEqual(carbonStorageInSoilForArtificialTreeFilled.length, 1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "soil" && soilCategory === "prairie_bushes",
    );

    assert.strictEqual(carbonStorageInSoilForPrairie.length, 1);

    const carbonStorageInSoilForWetLand = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "soil" && soilCategory === "wet_land",
    );

    assert.strictEqual(carbonStorageInSoilForWetLand.length, 1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "non_forest_biomass" && soilCategory === "artificial_tree_filled",
    );

    assert.strictEqual(carbonStorageInNonForestBiomassForArtificialTreeFilled.length, 1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "non_forest_biomass" && soilCategory === "prairie_bushes",
    );

    assert.strictEqual(carbonStorageInNonForestBiomassForPrairie.length, 1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory, localisationCategory }) =>
        reservoir === "dead_forest_biomass" &&
        soilCategory === "forest_conifer" &&
        localisationCategory === "region",
    );

    assert.strictEqual(carbonStorageInDeadForestBiomassForForest.length, 1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory, localisationCategory }) =>
        reservoir === "live_forest_biomass" &&
        soilCategory === "forest_conifer" &&
        localisationCategory === "region",
    );

    assert.strictEqual(carbonStorageInLiveForestBiomassForForest.length, 1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "litter" && soilCategory === "forest_conifer",
    );

    assert.strictEqual(carbonStorageInLitterForForest.length, 1);

    assert.strictEqual(result.length, 9);
  });

  it("Gets carbon storage entries for a city and specific soils for a city with unprecise information on forest", async () => {
    const soilCategories = ["artificial_tree_filled", "forest_mixed", "prairie_bushes"] as const;

    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01033", [
      ...soilCategories,
    ]);

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "soil" && soilCategory === "forest_mixed",
    );

    assert.strictEqual(carbonStorageInSoilForForest.length, 1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "soil" && soilCategory === "artificial_tree_filled",
    );

    assert.strictEqual(carbonStorageInSoilForArtificialTreeFilled.length, 1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "soil" && soilCategory === "prairie_bushes",
    );

    assert.strictEqual(carbonStorageInSoilForPrairie.length, 1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "non_forest_biomass" && soilCategory === "artificial_tree_filled",
    );

    assert.strictEqual(carbonStorageInNonForestBiomassForArtificialTreeFilled.length, 1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "non_forest_biomass" && soilCategory === "prairie_bushes",
    );

    assert.strictEqual(carbonStorageInNonForestBiomassForPrairie.length, 1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "dead_forest_biomass" && soilCategory === "forest_mixed",
    );

    assert.strictEqual(carbonStorageInDeadForestBiomassForForest.length, 1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === "live_forest_biomass" && soilCategory === "forest_mixed",
    );

    assert.strictEqual(carbonStorageInLiveForestBiomassForForest.length, 1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) => reservoir === "litter" && soilCategory === "forest_mixed",
    );

    assert.strictEqual(carbonStorageInLitterForForest.length, 1);

    assert.strictEqual(result.length, 8);
  });
});
