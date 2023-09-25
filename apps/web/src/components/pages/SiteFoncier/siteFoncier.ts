export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type SiteFoncier = {
  name: string;
  description: string;
  type: SiteFoncierType;
  address: string;
  surface: number;
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
  spaces: { type: NaturalAreaSpaceType; surface?: number }[];
  owners: Owner[];
  runningCompany: string;
  fullTimeJobsInvolvedCount: number;
  yearlyProfitAmount: number;
  yearlyRentAmount?: number;
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

// const n: NaturalArea = {
//   name: "Prairie Blajan, route des Pyrénnées",
//   description: "Une description de la prairie",
//   type: SiteFoncierType.NATURAL_AREA,
//   address: "1 route des Pyrénnées",
//   // spaces
//   surface: 5000,
//   spaces: {
//     prairie: {
//       grass: 0.8,
//       trees: 0,
//       bushes: 0.2,
//     },
//     forest: {},
//   },
//   spaces_: [
//     {
//       type: "prairie",
//       vegetation: {
//         grass: 0.8,
//       },
//     },
//   ],
//   // management
//   owners: [
//     {
//       type: OwnerType.AGRICULTURAL_COMPANY,
//       name: "Hello",
//     },
//     { type: OwnerType.LOCAL_OR_REGIONAL_AUTHORITY },
//   ],
//   manager: "GAEC La Castanède",
//   fullTimeJobsInvolvedCount: 1.5,
//   yearlyRentAmount: 2000,
// };
