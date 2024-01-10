// Values from database
export enum RepositorySoilCategoryType {
  // artificial
  IMPERMEABLE_SOILS = "impermeable_soils",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED = "artificial_grass_or_bushes_filled",
  ARTIFICIAL_TREE_FILLED = "artificial_tree_filled",
  // forest
  FOREST_DECIDUOUS = "forest_deciduous",
  FOREST_CONIFER = "forest_conifer",
  FOREST_POPLAR = "forest_poplar",
  FOREST_MIXED = "forest_mixed",
  // prairie
  PRAIRIE_GRASS = "prairie_grass",
  PRAIRIE_BUSHES = "prairie_bushes",
  PRAIRIE_TREES = "prairie_trees",
  // other
  ORCHARD = "orchard", // verger
  CULTIVATION = "cultivation", // culture
  VINEYARD = "vineyard", // vigne
  WET_LAND = "wet_land", // zone humide
  WATER = "water", // plan d'eau
}

export enum ReservoirType {
  SOIL = "soil",
  NON_FOREST_BIOMASS = "non_forest_biomass",
  DEAD_FOREST_BIOMASS = "dead_forest_biomass",
  LIVE_FOREST_BIOMASS = "live_forest_biomass",
  LITTER = "litter",
}

export enum LocalisationCategoryType {
  ZPC = "zpc",
  REGION = "region",
  SER_GROUP = "groupeser",
  GRECO = "greco",
  POPLAR_POOL = "bassin_populicole",
  COUNTRY = "pays",
}

export type CarbonStorageProps = {
  reservoir: ReservoirType;
  soil_category: RepositorySoilCategoryType;
  stock_tC_by_ha: string;
  localisation_category: LocalisationCategoryType;
  localisation_code: string;
};

export class CarbonStorage {
  private constructor(
    readonly reservoir: ReservoirType,
    readonly soilCategory: RepositorySoilCategoryType,
    readonly carbonStorageInTonByHectare: number,
    readonly localisationCategory: LocalisationCategoryType,
    readonly localisationCode: string,
  ) {}

  static create({
    reservoir,
    soil_category,
    stock_tC_by_ha,
    localisation_category,
    localisation_code,
  }: CarbonStorageProps): CarbonStorage {
    return new CarbonStorage(
      reservoir,
      soil_category,
      parseFloat(stock_tC_by_ha),
      localisation_category,
      localisation_code,
    );
  }

  toDatabaseFormat() {
    return {
      reservoir: this.reservoir,
      soil_category: this.soilCategory,
      stock_tC_by_ha: this.carbonStorageInTonByHectare.toString(),
      localisation_category: this.localisationCategory,
      localisation_code: this.localisationCode,
    };
  }
}
