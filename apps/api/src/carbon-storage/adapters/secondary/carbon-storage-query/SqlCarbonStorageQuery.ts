import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { CarbonStorageQuery } from "src/carbon-storage/core/gateways/CarbonStorageQuery";
import {
  CarbonStorage,
  CarbonStorageProps,
  LocalisationCategoryType,
  RepositorySoilCategoryType,
  ReservoirType,
} from "src/carbon-storage/core/models/carbonStorage";
import { City, CityProps } from "src/carbon-storage/core/models/city";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

const FOREST_CATEGORIES = [
  "forest_conifer",
  "forest_deciduous",
  "forest_mixed",
  "forest_poplar",
] as const;

type ForestCategory = (typeof FOREST_CATEGORIES)[number];

const filterCarbonStorageByLocalisationPriority = (carbonStorage: CarbonStorage[]) => {
  const localisationPriorityOrder = [
    LocalisationCategoryType.SER_GROUP,
    LocalisationCategoryType.GRECO,
    LocalisationCategoryType.REGION,
    LocalisationCategoryType.POPLAR_POOL,
    LocalisationCategoryType.COUNTRY,
  ];

  return carbonStorage.reduce((result: CarbonStorage[], entry) => {
    // Check if there is already an entry for this category
    const existingIndex = result.findIndex(
      (element) => element.soilCategory === entry.soilCategory,
    );
    const existingEntry = result[existingIndex];
    if (!existingEntry) {
      return [...result, entry];
    }

    const { localisationCategory } = existingEntry;
    const currentPosition = localisationPriorityOrder.indexOf(localisationCategory);
    const elemPosition = localisationPriorityOrder.indexOf(entry.localisationCategory);
    if (elemPosition < currentPosition) {
      const newResult = [...result];
      newResult[existingIndex] = entry;
      return newResult;
    }
    return result;
  }, []);
};

const getForestLitterCarbonStorage = (soilCategories: RepositorySoilCategoryType[]) => {
  const forestCategories =
    soilCategories.length === 0
      ? FOREST_CATEGORIES
      : soilCategories.filter((category) => FOREST_CATEGORIES.includes(category as ForestCategory));
  return forestCategories.map(
    (category) =>
      ({
        localisationCode: "France",
        localisationCategory: LocalisationCategoryType.COUNTRY,
        soilCategory: category,
        carbonStorageInTonByHectare: 9,
        reservoir: ReservoirType.LITTER,
      }) as CarbonStorage,
  );
};

export class SqlCarbonStorageQuery implements CarbonStorageQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getCarbonStorageForCity(
    cityCode: string,
    soilCategories: RepositorySoilCategoryType[],
  ): Promise<CarbonStorage[]> {
    // Get zpc, region, code_groupeser...
    const sqlCity = await this.sqlConnection<CityProps>("cities")
      .select()
      .where({ insee: cityCode })
      .first();

    if (!sqlCity) {
      throw new Error(`City with code ${cityCode} not found in database`);
    }

    const city = City.create(sqlCity);

    const hasSoilsCategory = soilCategories.length > 0;
    const hasForest = soilCategories.some((category) =>
      FOREST_CATEGORIES.includes(category as ForestCategory),
    );

    const query = this.sqlConnection<CarbonStorageProps>("carbon_storage").select();

    if (hasSoilsCategory) {
      void query.whereIn("soil_category", soilCategories);
    }

    void query.andWhere((localisationClause) => {
      void localisationClause
        // Search in reservoir "soil"
        .orWhere({
          localisation_code: city.zpc,
          localisation_category: LocalisationCategoryType.ZPC,
        })
        // Search in reservoir "non_forest_biomass" and "forest_biomass"
        .orWhere({
          localisation_code: city.region,
          localisation_category: LocalisationCategoryType.REGION,
        });

      if (hasForest || !hasSoilsCategory) {
        // Search in reservoir "live_forest_biomass" and "dead_forest_biomass"
        if (city.codeSerGroup.length > 0) {
          void localisationClause.orWhere((build) => {
            void build
              .where("localisation_category", LocalisationCategoryType.SER_GROUP)
              .whereIn("localisation_code", city.codeSerGroup);
          });
        }
        if (city.codeGreco.length > 0) {
          void localisationClause.orWhere((build) => {
            void build
              .where("localisation_category", LocalisationCategoryType.GRECO)
              .whereIn("localisation_code", city.codeGreco);
          });
        }

        if (city.codePoplarPool) {
          void localisationClause.orWhere({
            localisation_code: city.codePoplarPool,
            localisation_category: LocalisationCategoryType.POPLAR_POOL,
          });
        }

        void localisationClause.orWhere({
          localisation_code: "France",
          localisation_category: LocalisationCategoryType.COUNTRY,
        });
      }
    });

    const result = (await query).map((element) => CarbonStorage.create(element));

    const soilsStorage = result.filter(({ reservoir }) => reservoir === ReservoirType.SOIL);
    const nonForestBiomassStorage = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.NON_FOREST_BIOMASS,
    );

    // There is several value in db for forest_biomass with different level
    // of precision. We want to use the best value we can found.
    // See data/README.md
    const deadForestBiomass = filterCarbonStorageByLocalisationPriority(
      result.filter(({ reservoir }) => reservoir === ReservoirType.DEAD_FOREST_BIOMASS),
    );
    const liveForestBiomass = filterCarbonStorageByLocalisationPriority(
      result.filter(({ reservoir }) => reservoir === ReservoirType.LIVE_FOREST_BIOMASS),
    );

    // Litter biomass for forest is a constant value standing for the average value in France
    // See data/README.md
    const litterBiomass = getForestLitterCarbonStorage(soilCategories);

    return [
      ...soilsStorage,
      ...nonForestBiomassStorage,
      ...deadForestBiomass,
      ...liveForestBiomass,
      ...litterBiomass,
    ];
  }
}
