export enum SoilCategoryType {
  // artificial
  BUILDINGS = "buildings",
  IMPERMEABLE_SOILS = "impermeable_soils",
  MINERAL_SOIL = "mineral_soil",
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

type CarbonStorageProps = {
  reservoir: ReservoirType;
  soil_category: SoilCategoryType;
  stock_tC_by_ha: number;
  localisation_category: LocalisationCategoryType;
  localisation_code: string;
};

export class CarbonStorage {
  private constructor(
    readonly reservoir: CarbonStorageProps["reservoir"],
    readonly soil_category: CarbonStorageProps["soil_category"],
    readonly stock_tC_by_ha: CarbonStorageProps["stock_tC_by_ha"],
    readonly localisation_category: CarbonStorageProps["localisation_category"],
    readonly localisation_code: CarbonStorageProps["localisation_code"],
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
      stock_tC_by_ha,
      localisation_category,
      localisation_code,
    );
  }
}
