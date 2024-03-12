import { z } from "zod";

export const soilTypeSchema = z.enum([
  "BUILDINGS",
  "IMPERMEABLE_SOILS",
  "MINERAL_SOIL",
  "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  "ARTIFICIAL_TREE_FILLED",
  "FOREST_DECIDUOUS",
  "FOREST_CONIFER",
  "FOREST_POPLAR",
  "FOREST_MIXED",
  "PRAIRIE_GRASS",
  "PRAIRIE_BUSHES",
  "PRAIRIE_TREES",
  "ORCHARD", // verger
  "CULTIVATION", // culture
  "VINEYARD", // vigne
  "WET_LAND", // zone humide
  "WATER", // plan d'eau
]);

export type SoilType = z.infer<typeof soilTypeSchema>;

export type SoilsDistribution = Partial<Record<SoilType, number>>;

const IMPERMEABLE_SOILS: readonly SoilType[] = ["BUILDINGS", "IMPERMEABLE_SOILS"];

export const isImpermeableSoil = (soilType: SoilType) => {
  return IMPERMEABLE_SOILS.includes(soilType);
};

export const isPermeableSoil = (soilType: SoilType) => {
  return !isImpermeableSoil(soilType);
};

export const isMineralSoil = (soilType: SoilType) => {
  return soilType === "MINERAL_SOIL";
};

const GREEN_SOILS: readonly SoilType[] = [
  "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  "ARTIFICIAL_TREE_FILLED",
  "FOREST_CONIFER",
  "FOREST_DECIDUOUS",
  "FOREST_MIXED",
  "FOREST_POPLAR",
  "PRAIRIE_BUSHES",
  "PRAIRIE_GRASS",
  "PRAIRIE_TREES",
  "CULTIVATION",
  "VINEYARD",
  "ORCHARD",
];

export const isGreenSoil = (soilType: SoilType) => {
  return GREEN_SOILS.includes(soilType);
};
