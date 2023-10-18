import knex, { Knex } from "knex";
import {
  ReservoirType,
  SoilCategoryType,
} from "src/carbon-storage/domain/models/carbonStorage";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlCarbonStorageRepository } from "./SqlCarbonStorageRepository";

describe("SqlCarbonStorageRepository integration", () => {
  let sqlConnection: Knex;
  let sqlCarbonStorageRepository: SqlCarbonStorageRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
    sqlCarbonStorageRepository = new SqlCarbonStorageRepository(sqlConnection);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  test("returns error if no city code is provided", async () => {
    await expect(() =>
      sqlCarbonStorageRepository.getCarbonStorageForCity("", []),
    ).rejects.toThrow();
  });

  test("returns values for all soil categories if no category is provided", async () => {
    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01027",
      [],
    );
    const soilStorageValues = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.SOIL,
    );
    expect(soilStorageValues.length).toEqual(10);

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
    const soilCategories = [
      "artificial_tree_filled",
      "forest_deciduous",
    ] as SoilCategoryType[];

    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01027",
      soilCategories,
    );

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.FOREST,
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    // RESERVOIR NON FOREST BIOMASS
    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForArtificialTreeFilled =
      result.filter(
        ({ reservoir, soil_category }) =>
          reservoir === ReservoirType.NON_FOREST_BIOMASS &&
          soil_category === SoilCategoryType.ARTIFICIAL_TREE_FILLED,
      );

    // RESERVOIR FOREST BIOMASS
    expect(
      carbonStorageInNonForestBiomassForArtificialTreeFilled.length,
    ).toEqual(1);

    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.FOREST_DECIDUOUS,
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.FOREST_DECIDUOUS,
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.LITTER &&
        soil_category === SoilCategoryType.FOREST_DECIDUOUS,
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
    ] as SoilCategoryType[];

    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01026",
      soilCategories,
    );

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.FOREST,
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.PRAIRIE,
    );

    expect(carbonStorageInSoilForPrairie.length).toEqual(1);

    const carbonStorageInSoilForWetLand = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.WET_LAND,
    );

    expect(carbonStorageInSoilForWetLand.length).toEqual(1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled =
      result.filter(
        ({ reservoir, soil_category }) =>
          reservoir === ReservoirType.NON_FOREST_BIOMASS &&
          soil_category === SoilCategoryType.ARTIFICIAL_TREE_FILLED,
      );

    expect(
      carbonStorageInNonForestBiomassForArtificialTreeFilled.length,
    ).toEqual(1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.PRAIRIE_BUSHES,
    );

    expect(carbonStorageInNonForestBiomassForPrairie.length).toEqual(1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soil_category, localisation_code }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.FOREST_CONIFER &&
        localisation_code === "France",
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soil_category, localisation_code }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.FOREST_CONIFER &&
        localisation_code === "France",
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.LITTER &&
        soil_category === SoilCategoryType.FOREST_CONIFER,
    );

    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(9);
  });

  test("Gets carbon storage entries for a city and specific soils for a city with unprecise information on forest", async () => {
    const soilCategories = [
      "artificial_tree_filled",
      "forest_mixed",
      "prairie_bushes",
    ] as SoilCategoryType[];

    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01033",
      soilCategories,
    );

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.FOREST,
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.SOIL &&
        soil_category === SoilCategoryType.PRAIRIE,
    );

    expect(carbonStorageInSoilForPrairie.length).toEqual(1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled =
      result.filter(
        ({ reservoir, soil_category }) =>
          reservoir === ReservoirType.NON_FOREST_BIOMASS &&
          soil_category === SoilCategoryType.ARTIFICIAL_TREE_FILLED,
      );

    expect(
      carbonStorageInNonForestBiomassForArtificialTreeFilled.length,
    ).toEqual(1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.PRAIRIE_BUSHES,
    );

    expect(carbonStorageInNonForestBiomassForPrairie.length).toEqual(1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soil_category === SoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soil_category }) =>
        reservoir === ReservoirType.LITTER &&
        soil_category === SoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(8);
  });
});
