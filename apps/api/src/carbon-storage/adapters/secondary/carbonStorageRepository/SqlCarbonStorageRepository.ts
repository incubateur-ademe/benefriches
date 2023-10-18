import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Knex } from "knex";
import { CarbonStorageRepository } from "src/carbon-storage/domain/gateways/CarbonStorageRepository";
import {
  CarbonStorage,
  LocalisationCategoryType,
  ReservoirType,
  SoilCategoryType,
} from "src/carbon-storage/domain/models/carbonStorage";
import { City } from "src/carbon-storage/domain/models/city";

const FOREST_CATEGORIES = [
  SoilCategoryType.FOREST_CONIFER,
  SoilCategoryType.FOREST_DECIDUOUS,
  SoilCategoryType.FOREST_MIXED,
  SoilCategoryType.FOREST_POPLAR,
];

const PRAIRIE_CATEGORIES = [
  SoilCategoryType.PRAIRIE_BUSHES,
  SoilCategoryType.PRAIRIE_GRASS,
  SoilCategoryType.PRAIRIE_TREES,
];

const filterCarbonStorageByLocalisationPriority = (
  carbonStorage: CarbonStorage[],
) => {
  const localisationPriorityOrder = [
    LocalisationCategoryType.SER_GROUP,
    LocalisationCategoryType.GRECO,
    LocalisationCategoryType.RAD13,
    LocalisationCategoryType.POPULATION_BASE,
    LocalisationCategoryType.COUNTRY,
  ];

  return carbonStorage.reduce((result: CarbonStorage[], entry) => {
    // Check if there is already an entry for this category
    const existingIndex = result.findIndex(
      (element) => element.soil_category === entry.soil_category,
    );
    if (existingIndex === -1) {
      return [...result, entry];
    }

    const { localisation_category } = result[existingIndex];
    const currentPosition = localisationPriorityOrder.indexOf(
      localisation_category,
    );
    const elemPosition = localisationPriorityOrder.indexOf(
      entry.localisation_category,
    );
    if (elemPosition < currentPosition) {
      const newResult = [...result];
      newResult[existingIndex] = entry;
      return newResult;
    }
    return [...result];
  }, []);
};

const getForestLitterCarbonStorage = (soilCategories: SoilCategoryType[]) => {
  const forestCategories =
    soilCategories.length === 0
      ? FOREST_CATEGORIES
      : soilCategories.filter((category) =>
          FOREST_CATEGORIES.includes(category),
        );
  return forestCategories.map(
    (category) =>
      ({
        localisation_code: "France",
        localisation_category: LocalisationCategoryType.COUNTRY,
        soil_category: category,
        stock_tC_by_ha: 9,
        reservoir: ReservoirType.LITTER,
      }) as CarbonStorage,
  );
};

@Injectable()
export class SqlCarbonStorageRepository implements CarbonStorageRepository {
  constructor(private readonly sqlConnection: Knex) {}

  async getCarbonStorageForCity(
    cityCode: string,
    soilCategories: SoilCategoryType[],
  ): Promise<CarbonStorage[]> {
    if (cityCode.length === 0) {
      throw new BadRequestException();
    }

    // Get zpc, region, code_groupeser...
    const city = await this.sqlConnection<City>("cities")
      .select()
      .where({ insee: cityCode })
      .first();

    if (!city) {
      throw new NotFoundException();
    }

    const hasSoilsCategory = soilCategories.length > 0;
    const hasForest = soilCategories.some((category) =>
      FOREST_CATEGORIES.includes(category),
    );
    const hasPrairie = soilCategories.some((category) =>
      PRAIRIE_CATEGORIES.includes(category),
    );

    const query = this.sqlConnection<CarbonStorage>("carbon_storage").select();

    if (hasSoilsCategory) {
      void query.where((soilsCategoryClause) => {
        void soilsCategoryClause.whereIn("soil_category", soilCategories);
        if (hasForest) {
          void soilsCategoryClause.orWhere(
            "soil_category",
            SoilCategoryType.FOREST,
          );
        }
        if (hasPrairie) {
          void soilsCategoryClause.orWhere(
            "soil_category",
            SoilCategoryType.PRAIRIE,
          );
        }
      });
    }

    void query.andWhere((localisationClause) => {
      void localisationClause
        // Search in reservoir "soil"
        .orWhere({
          localisation_code: city.zpc,
          localisation_category: LocalisationCategoryType.ZPC,
        })
        // Search in reservoir "non_forest_biomass"
        .orWhere({
          localisation_code: city.region,
          localisation_category: LocalisationCategoryType.REGION,
        });

      if (hasForest || !hasSoilsCategory) {
        // Search in reservoir "live_forest_biomass" and "dead_forest_biomass"
        void localisationClause.orWhere((build) => {
          void build
            .where("localisation_category", LocalisationCategoryType.SER_GROUP)
            .whereIn("localisation_code", city.code_groupeser);
        });

        void localisationClause.orWhere((build) => {
          void build
            .where("localisation_category", LocalisationCategoryType.GRECO)
            .whereIn("localisation_code", city.code_greco);
        });
        void localisationClause.orWhere({
          localisation_code: city.code_rad13,
          localisation_category: LocalisationCategoryType.RAD13,
        });
        void localisationClause.orWhere({
          localisation_code: city.code_bassin_populicole,
          localisation_category: LocalisationCategoryType.POPULATION_BASE,
        });
        void localisationClause.orWhere({
          localisation_code: "France",
          localisation_category: LocalisationCategoryType.COUNTRY,
        });
      }
    });

    const result = await query;

    const soilsStorage = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.SOIL,
    );
    const nonForestBiomassStorage = result.filter(
      ({ reservoir }) => reservoir === ReservoirType.NON_FOREST_BIOMASS,
    );

    // There is several value in db for forest_biomass with different level
    // of precision. We want to use the best value we can found.
    // See data/README.md
    const deadForestBiomass = filterCarbonStorageByLocalisationPriority(
      result.filter(
        ({ reservoir }) => reservoir === ReservoirType.DEAD_FOREST_BIOMASS,
      ),
    );
    const liveForestBiomass = filterCarbonStorageByLocalisationPriority(
      result.filter(
        ({ reservoir }) => reservoir === ReservoirType.LIVE_FOREST_BIOMASS,
      ),
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
