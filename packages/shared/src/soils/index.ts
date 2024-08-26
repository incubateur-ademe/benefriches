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

export const soilTypes = soilTypeSchema.options;

export type SoilType = z.infer<typeof soilTypeSchema>;

export const isImpermeableSoil = (soilType: SoilType) => {
  return ["BUILDINGS", "IMPERMEABLE_SOILS"].includes(soilType);
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

const FOREST_SOILS: readonly SoilType[] = [
  "FOREST_CONIFER",
  "FOREST_DECIDUOUS",
  "FOREST_MIXED",
  "FOREST_POPLAR",
];
const PRAIRIE_SOILS: readonly SoilType[] = ["PRAIRIE_BUSHES", "PRAIRIE_GRASS", "PRAIRIE_TREES"];

export const isGreenSoil = (soilType: SoilType) => {
  return GREEN_SOILS.includes(soilType);
};

export const isPrairie = (soilType: SoilType) => {
  return PRAIRIE_SOILS.includes(soilType);
};

export const isForest = (soilType: SoilType) => {
  return FOREST_SOILS.includes(soilType);
};

export const isWetLand = (soilType: SoilType) => {
  return "WET_LAND" === soilType;
};

export const isSurfaceWithEcosystemBenefits = (soilType: SoilType) => {
  return [...FOREST_SOILS, ...PRAIRIE_SOILS, "ARTIFICIAL_TREE_FILLED", "WET_LAND"].includes(
    soilType,
  );
};

export const isSurfaceWithPermanentVegetation = (soilType: SoilType) => {
  return isSurfaceWithEcosystemBenefits(soilType);
};

export const isPermeableSurfaceWithoutPermanentVegetation = (soilType: SoilType) => {
  return [
    "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    "CULTIVATION",
    "VINEYARD",
    "ORCHARD",
    "MINERAL_SOIL",
  ].includes(soilType);
};

export const isSoilAgricultural = (soilType: SoilType): boolean => {
  return ["VINEYARD", "ORCHARD", "CULTIVATION"].includes(soilType);
};

export * from "./soilDistribution";
