import knex, { Knex } from "knex";
import {
  LocalisationCategoryType,
  RepositorySoilCategoryType,
  ReservoirType,
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
    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity("01027", []);
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
    const soilCategories = [
      RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
      RepositorySoilCategoryType.FOREST_DECIDUOUS,
    ];

    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01027",
      soilCategories,
    );

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.FOREST_DECIDUOUS,
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    // RESERVOIR NON FOREST BIOMASS
    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    // RESERVOIR FOREST BIOMASS
    expect(carbonStorageInNonForestBiomassForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.FOREST_DECIDUOUS,
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.FOREST_DECIDUOUS,
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LITTER &&
        soilCategory === RepositorySoilCategoryType.FOREST_DECIDUOUS,
    );

    // RESERVOIR FOREST LITTER
    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(6);
  });

  test("Gets carbon storage entries for a city and specific soils for a city with no information on forest", async () => {
    const soilCategories = [
      RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
      RepositorySoilCategoryType.FOREST_CONIFER,
      RepositorySoilCategoryType.PRAIRIE_BUSHES,
      RepositorySoilCategoryType.WATER,
      RepositorySoilCategoryType.WET_LAND,
    ];

    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01026",
      soilCategories,
    );

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.FOREST_CONIFER,
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.PRAIRIE_BUSHES,
    );

    expect(carbonStorageInSoilForPrairie.length).toEqual(1);

    const carbonStorageInSoilForWetLand = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL && soilCategory === RepositorySoilCategoryType.WET_LAND,
    );

    expect(carbonStorageInSoilForWetLand.length).toEqual(1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    expect(carbonStorageInNonForestBiomassForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.PRAIRIE_BUSHES,
    );

    expect(carbonStorageInNonForestBiomassForPrairie.length).toEqual(1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory, localisationCategory }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.FOREST_CONIFER &&
        localisationCategory === LocalisationCategoryType.REGION,
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory, localisationCategory }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.FOREST_CONIFER &&
        localisationCategory === LocalisationCategoryType.REGION,
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LITTER &&
        soilCategory === RepositorySoilCategoryType.FOREST_CONIFER,
    );

    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(9);
  });

  test("Gets carbon storage entries for a city and specific soils for a city with unprecise information on forest", async () => {
    const soilCategories = [
      RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
      RepositorySoilCategoryType.FOREST_MIXED,
      RepositorySoilCategoryType.PRAIRIE_BUSHES,
    ];

    const result = await sqlCarbonStorageRepository.getCarbonStorageForCity(
      "01033",
      soilCategories,
    );

    // RESERVOIR SOIL
    const carbonStorageInSoilForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInSoilForForest.length).toEqual(1);

    const carbonStorageInSoilForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    expect(carbonStorageInSoilForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInSoilForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.SOIL &&
        soilCategory === RepositorySoilCategoryType.PRAIRIE_BUSHES,
    );

    expect(carbonStorageInSoilForPrairie.length).toEqual(1);

    // RESERVOIR NF BIOMASS
    const carbonStorageInNonForestBiomassForArtificialTreeFilled = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.ARTIFICIAL_TREE_FILLED,
    );

    expect(carbonStorageInNonForestBiomassForArtificialTreeFilled.length).toEqual(1);

    const carbonStorageInNonForestBiomassForPrairie = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.NON_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.PRAIRIE_BUSHES,
    );

    expect(carbonStorageInNonForestBiomassForPrairie.length).toEqual(1);

    // RESERVOIR FOREST BIOMASS
    const carbonStorageInDeadForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.DEAD_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInDeadForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLiveForestBiomassForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LIVE_FOREST_BIOMASS &&
        soilCategory === RepositorySoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInLiveForestBiomassForForest.length).toEqual(1);

    const carbonStorageInLitterForForest = result.filter(
      ({ reservoir, soilCategory }) =>
        reservoir === ReservoirType.LITTER &&
        soilCategory === RepositorySoilCategoryType.FOREST_MIXED,
    );

    expect(carbonStorageInLitterForForest.length).toEqual(1);

    expect(result.length).toEqual(8);
  });
});
