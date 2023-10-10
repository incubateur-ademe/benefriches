import { NaturalAreaSpaceType } from "./naturalArea.types";
import { SiteFoncier, SiteFoncierType } from "./siteFoncier.types";

export type FricheSite = SiteFoncier & {
  type: SiteFoncierType.FRICHE;
  surfaceArea: number;
  soils: FricheSoilType[];
  soilsSurfaceAreas: Partial<Record<FricheSoilType, number>>;
  hasNaturalOrAgriculturalSoils: boolean;
  lastActivity?: FricheLastActivity;
  naturalAreas?: NaturalAreaSpaceType[];
  contaminatedSoilSurface: number;
};

export enum FricheLastActivity {
  AGRICULTURE = "AGRICULTURE",
  INDUSTRY = "INDUSTRY",
  MINE_OR_QUARRY = "MINE_OR_QUARRY",
  HOUSING_OR_BUSINESS = "HOUSING_OR_BUSINESS",
  UNKNOWN = "UNKNOWN",
}

export enum FricheSoilType {
  BUILDINGS = "BUILDINGS",
  IMPERMEABLE_SOILS = "IMPERMEABLE_SOILS",
  MINERAL_SOIL = "MINERAL_SOIL",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED = "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  ARTIFICIAL_TREE_FILLED = "ARTIFICIAL_TREE_FILLED",
  FOREST_DECIDUOUS = "FOREST_DECIDUOUS",
  FOREST_CONIFER = "FOREST_CONIFER",
  FOREST_POPLAR = "FOREST_POPLAR",
  FOREST_MIXED = "FOREST_MIXED",
  PRAIRIE_GRASS = "PRAIRIE_GRASS",
  PRAIRIE_BUSHES = "PRAIRIE_BUSHES",
  PRAIRIE_TREES = "PRAIRIE_TREES",
  ORCHARD = "ORCHARD", // verger
  CULTIVATION = "CULTIVATION", // culture
  VINEYARD = "VINEYARD", // vigne
  WET_LAND = "WET_LAND", // zone humide
  WATER = "WATER", // plan d'eau
  UNKNOWN_NATURAL_AREA = "UNKNOWN_NATURAL_AREA",
}
