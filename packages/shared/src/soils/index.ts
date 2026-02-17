import { z } from "zod";

export const ORDERED_SOIL_TYPES = [
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
] as const;
export const soilTypeSchema = z.enum(ORDERED_SOIL_TYPES);

export const soilTypes = soilTypeSchema.options;

export type SoilType = z.infer<typeof soilTypeSchema>;

export const soilsDistributionSchema = z.partialRecord(soilTypeSchema, z.number().nonnegative());

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

const isWater = (soilType: SoilType) => {
  return "WATER" === soilType;
};

export const isNaturalSoil = (soilType: SoilType) => {
  return isForest(soilType) || isPrairie(soilType) || isWetLand(soilType) || isWater(soilType);
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

/**
 * Soil types that can only be part of a reconversion project if they already exist on the site.
 * These cannot be "created" by development - they can only be preserved.
 *
 * Constrained soils include: forests, prairies, agricultural lands, wetlands, and water.
 * Non-constrained soils (BUILDINGS, IMPERMEABLE_SOILS, MINERAL_SOIL, ARTIFICIAL_*) can be created.
 */
export const CONSTRAINED_SOIL_TYPES: ReadonlySet<SoilType> = new Set([
  "PRAIRIE_GRASS",
  "PRAIRIE_BUSHES",
  "PRAIRIE_TREES",
  "FOREST_DECIDUOUS",
  "FOREST_CONIFER",
  "FOREST_POPLAR",
  "FOREST_MIXED",
  "CULTIVATION",
  "VINEYARD",
  "ORCHARD",
  "WET_LAND",
  "WATER",
]);

export const isConstrainedSoilType = (soilType: SoilType): boolean => {
  return CONSTRAINED_SOIL_TYPES.has(soilType);
};

export * from "./soilDistribution";
export * from "./soilsDistributionObjToArray";
export * from "./soilDistributionByType";
