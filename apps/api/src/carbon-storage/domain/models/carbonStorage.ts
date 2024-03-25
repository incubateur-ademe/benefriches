// Values from database
export type RepositorySoilCategoryType =
  | "impermeable_soils"
  | "artificial_grass_or_bushes_filled"
  | "artificial_tree_filled"
  | "forest_deciduous"
  | "forest_conifer"
  | "forest_poplar"
  | "forest_mixed"
  | "prairie_grass"
  | "prairie_bushes"
  | "prairie_trees"
  | "orchard"
  | "cultivation"
  | "vineyard"
  | "wet_land"
  | "water";

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
