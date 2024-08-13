import knex, { Knex } from "knex";
import {
  LocalisationCategoryType,
  ReservoirType,
} from "src/carbon-storage/core/models/carbonStorage";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlCarbonStorageQuery } from "./SqlCarbonStorageQuery";

describe("SqlCarbonStorageQuery integration", () => {
  let sqlConnection: Knex;
  let sqlCarbonStorageQuery: SqlCarbonStorageQuery;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
    sqlCarbonStorageQuery = new SqlCarbonStorageQuery(sqlConnection);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  test("returns error if no city code is provided", async () => {
    await expect(() => sqlCarbonStorageQuery.getCarbonStorageForCity("", [])).rejects.toThrow();
  });

  test("returns values for all soil categories if no category is provided", async () => {
    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01027", []);
    const soilStorageValues = result.filter(({ reservoir }) => reservoir === ReservoirType.SOIL);
    expect(soilStorageValues.length).toEqual(15);

    const nonForestBiomassStorageValues = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.NON_FOREST_BIOMASS,
    );
    expect(nonForestBiomassStorageValues.length).toEqual(6);

    const deadForestBiomassStorageValues = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.DEAD_FOREST_BIOMASS,
    );
    expect(deadForestBiomassStorageValues.length).toEqual(4);

    const liveForestBiomassStorageValues = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.LIVE_FOREST_BIOMASS,
    );
    expect(liveForestBiomassStorageValues.length).toEqual(4);

    const litterForestStorageValues = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.LITTER,
    );
    expect(litterForestStorageValues.length).toEqual(4);
  });

  test("Gets carbon storage entries for a city and specific soils for a simple case", async () => {
    const soilCategories = ["artificial_tree_filled", "forest_deciduous"] as const;

    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01027", [
      ...soilCategories,
    ]);

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "forest_deciduous",
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "artificial_tree_filled",
    );

    // RESERVOIR NON FOREST BIOMASS
    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS && soilCategory === "artificial_tree_filled",
    );

    // RESERVOIR FOREST BIOMASS
    expect(carbonStorageInNonForestBiomassForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS && soilCategory === "forest_deciduous",
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS && soilCategory === "forest_deciduous",
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LITTER && soilCategory === "forest_deciduous",
    );

    // RESERVOIR FOREST LITTER
    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(6);
  });

  test("Gets carbon storage entries for a city and specific soils for a city with no information on forest", async () => {
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
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "forest_conifer",
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "artificial_tree_filled",
    );

    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "prairie_bushes",
    );

    expect(carbonStorageInSoilForPrairie.length).toEqual(1);

    const carbonStorageInSoilForWetLand = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "wet_land",
    );

    expect(carbonStorageInSoilForWetLand.length).toEqual(1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS && soilCategory === "artificial_tree_filled",
    );

    expect(carbonStorageInNonForestBiomassForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS && soilCategory === "prairie_bushes",
    );

    expect(carbonStorageInNonForestBiomassForPrairie.length).toEqual(1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory, localisationCategory }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soilCategory === "forest_conifer" &&
        localisationCategory === LocalisationCategoryType.REGION,
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory, localisationCategory }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soilCategory === "forest_conifer" &&
        localisationCategory === LocalisationCategoryType.REGION,
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LITTER && soilCategory === "forest_conifer",
    );

    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(9);
  });

  test("Gets carbon storage entries for a city and specific soils for a city with unprecise information on forest", async () => {
    const soilCategories = ["artificial_tree_filled", "forest_mixed", "prairie_bushes"] as const;

    const result = await sqlCarbonStorageQuery.getCarbonStorageForCity("01033", [
      ...soilCategories,
    ]);

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "forest_mixed",
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "artificial_tree_filled",
    );

    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === "prairie_bushes",
    );

    expect(carbonStorageInSoilForPrairie.length).toEqual(1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS && soilCategory === "artificial_tree_filled",
    );

    expect(carbonStorageInNonForestBiomassForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS && soilCategory === "prairie_bushes",
    );

    expect(carbonStorageInNonForestBiomassForPrairie.length).toEqual(1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS && soilCategory === "forest_mixed",
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS && soilCategory === "forest_mixed",
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LITTER && soilCategory === "forest_mixed",
    );

    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(8);
  });
});
