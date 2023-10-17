// ZPC = zone pédo climatique
// https://docs.datagir.ademe.fr/documentation-aldo/stocks/methode-generale

export enum SoilType {
  // artificiels
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
  // autre
  ORCHARD = "orchard", // verger
  CULTIVATION = "cultivation", // culture
  VINEYARD = "vineyard", // vigne
  WET_LAND = "wet_land", // zone humide
  WATER = "water", // plan d'eau
}

type CarbonStorageProps = {
  reservoir:
    | "dead_forest_biomass"
    | "live_forest_biomass"
    | "soil"
    | "non_forest_biomass"
    | "litter";
  soil_category: SoilType;
  stock_tC_by_ha: number;
  localisation_category:
    | "zpc"
    | "region"
    | "groupeser"
    | "greco"
    | "rad13"
    | "bassin_populicole"
    | "pays";
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
