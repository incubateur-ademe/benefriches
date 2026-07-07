import { Inject } from "@nestjs/common";
import type { Knex } from "knex";

import { CarbonStorageQuery } from "src/carbon-storage/core/gateways/CarbonStorageQuery";
import {
  CarbonStorage,
  CarbonStorageProps,
  RepositorySoilCategoryType,
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
  const localisationPriorityOrder = ["groupeser", "greco", "region", "bassin_populicole", "pays"];

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
        localisationCategory: "pays",
        soilCategory: category,
        carbonStorageInTonByHectare: 9,
        reservoir: "litter",
      }) as CarbonStorage,
  );
};

export class SqlCarbonStorageQuery implements CarbonStorageQuery {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async getCarbonStorageForCity(
    cityCode: string,
    soilCategories: RepositorySoilCategoryType[],
  ): Promise<CarbonStorage[]> {
    // Get zpc, region, code_groupeser...
    const sqlCity = await this.sqlConnection<CityProps>("cities")
      .select()
      .where({ city_code: cityCode })
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
          localisation_category: "zpc",
        })
        // Search in reservoir "non_forest_biomass" and "forest_biomass"
        .orWhere({
          localisation_code: city.region,
          localisation_category: "region",
        });

      if (hasForest || !hasSoilsCategory) {
        // Search in reservoir "live_forest_biomass" and "dead_forest_biomass"
        if (city.codeSerGroup.length > 0) {
          void localisationClause.orWhere((build) => {
            void build
              .where("localisation_category", "groupeser")
              .whereIn("localisation_code", city.codeSerGroup);
          });
        }
        if (city.codeGreco.length > 0) {
          void localisationClause.orWhere((build) => {
            void build
              .where("localisation_category", "greco")
              .whereIn("localisation_code", city.codeGreco);
          });
        }

        if (city.codePoplarPool) {
          void localisationClause.orWhere({
            localisation_code: city.codePoplarPool,
            localisation_category: "bassin_populicole",
          });
        }

        void localisationClause.orWhere({
          localisation_code: "France",
          localisation_category: "pays",
        });
      }
    });

    const result = (await query).map((element) => CarbonStorage.create(element));

    const soilsStorage = result.filter(({ reservoir }) => reservoir === "soil");
    const nonForestBiomassStorage = result.filter(
      ({ reservoir }) => reservoir === "non_forest_biomass",
    );

    // There is several value in db for forest_biomass with different level
    // of precision. We want to use the best value we can found.
    // See data/README.md
    const deadForestBiomass = filterCarbonStorageByLocalisationPriority(
      result.filter(({ reservoir }) => reservoir === "dead_forest_biomass"),
    );
    const liveForestBiomass = filterCarbonStorageByLocalisationPriority(
      result.filter(({ reservoir }) => reservoir === "live_forest_biomass"),
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
