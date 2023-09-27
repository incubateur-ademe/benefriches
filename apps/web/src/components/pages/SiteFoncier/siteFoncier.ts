export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type SiteFoncier = {
  name: string;
  description: string;
  type: SiteFoncierType;
  address: string;
};

export enum FricheSpaceType {
  "IMPERMEABLE_SOILS" = "impermeable_soils",
  "BUILDINGS" = "buildings",
  "PERMEABLE_ARTIFICIAL_SOILS" = "permeable_artificial_soils",
  "NATURAL_AREAS" = "natural_areas",
  "AGRICULTURAL_LAND" = "AGRICULTURAL_LAND",
  "OTHER" = "other",
}

export enum FricheLastActivity {
  AGRICULTURE = "AGRICULTURE",
  INDUSTRY = "INDUSTRY",
  MINE_OR_QUARRY = "MINE_OR_QUARRY",
  HOUSING_OR_BUSINESS = "HOUSING_OR_BUSINESS",
}

export type FricheSite = SiteFoncier & {
  type: SiteFoncierType.FRICHE;
  lastActivity?: FricheLastActivity;
  spaces: { type: FricheSpaceType; surface?: number }[];
};

export enum NaturalAreaSpaceType {
  ORCHARD = "ORCHARD", // verger
  CULTIVATION = "CULTIVATION", // culture
  VINEYARD = "VINEYARD", // vigne
  PRAIRIE = "PRAIRIE",
  FOREST = "FOREST",
  WET_LAND = "WET_LAND", // zone humide
  WATER = "WATER", // plan d'eau
}

export enum VegetationType {
  GRASS = "GRASS",
  TREES = "TREES",
  BUSHES = "BUSHES",
}

export type NaturalArea = SiteFoncier & {
  type: SiteFoncierType.NATURAL_AREA;
  spaces: NaturalAreaSpace[];
  owners: Owner[];
  runningCompany: string;
  fullTimeJobsInvolvedCount: number;
  yearlyProfitAmount: number;
  yearlyRentAmount?: number;
};

export enum TreeType {
  DECIDUOUS = "DECIDUOUS", // feuillus
  RESINOUS = "RESINOUS",
  POPLAR = "POPLAR", // peupleraie
  MIXED = "MIXED",
}

export type Forest = {
  type: NaturalAreaSpaceType.FOREST;
  trees: { type: TreeType; surface?: number }[];
};

type Prairie = {
  type: NaturalAreaSpaceType.PRAIRIE;
  vegetation: { type: VegetationType; surface?: number }[];
};

type OtherSpace = Omit<
  NaturalAreaSpaceType,
  NaturalAreaSpaceType.FOREST | NaturalAreaSpaceType.PRAIRIE
>;

type NaturalAreaSpace =
  | Forest
  | Prairie
  | {
      type: OtherSpace;
      surface?: number;
    };

export enum OwnerType {
  AGRICULTURAL_COMPANY = "AGRICULTURAL_COMPANY",
  LOCAL_OR_REGIONAL_AUTHORITY = "LOCAL_OR_REGIONAL_AUTHORITY",
  OTHER = "OTHER",
}

export type AgricultureCompany = {
  type: OwnerType.AGRICULTURAL_COMPANY;
  name: string;
};

export type Owner =
  | { type: OwnerType.LOCAL_OR_REGIONAL_AUTHORITY }
  | { type: OwnerType.OTHER }
  | AgricultureCompany;
