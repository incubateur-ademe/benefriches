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

export type ReservoirType =
  | "soil"
  | "non_forest_biomass"
  | "dead_forest_biomass"
  | "live_forest_biomass"
  | "litter";

export type LocalisationCategoryType =
  | "zpc"
  | "region"
  | "groupeser"
  | "greco"
  | "bassin_populicole"
  | "pays";

export type CarbonStorageProps = {
  reservoir: ReservoirType;
  soil_category: RepositorySoilCategoryType;
  stock_tC_by_ha: string;
  localisation_category: LocalisationCategoryType;
  localisation_code: string;
};

export class CarbonStorage {
  readonly reservoir: ReservoirType;
  readonly soilCategory: RepositorySoilCategoryType;
  readonly carbonStorageInTonByHectare: number;
  readonly localisationCategory: LocalisationCategoryType;
  readonly localisationCode: string;
  private constructor(
    reservoir: ReservoirType,
    soilCategory: RepositorySoilCategoryType,
    carbonStorageInTonByHectare: number,
    localisationCategory: LocalisationCategoryType,
    localisationCode: string,
  ) {
    this.reservoir = reservoir;
    this.soilCategory = soilCategory;
    this.carbonStorageInTonByHectare = carbonStorageInTonByHectare;
    this.localisationCategory = localisationCategory;
    this.localisationCode = localisationCode;
  }

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
