import z from "zod";

import { SoilType } from "../../../../soils";

export const urbanPublicSpace = z.enum([
  "IMPERMEABLE_SURFACE",
  "PERMEABLE_SURFACE",
  "GRASS_COVERED_SURFACE",
]);

export type UrbanPublicSpace = z.infer<typeof urbanPublicSpace>;

export const getSoilTypeForPublicSpace = (publicSpace: UrbanPublicSpace): SoilType => {
  switch (publicSpace) {
    case "IMPERMEABLE_SURFACE":
      return "IMPERMEABLE_SOILS";
    case "GRASS_COVERED_SURFACE":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "PERMEABLE_SURFACE":
      return "MINERAL_SOIL";
  }
};

export const getUrbanPublicSpaceFromSoilType = (soilType: SoilType): UrbanPublicSpace => {
  switch (soilType) {
    case "IMPERMEABLE_SOILS":
      return "IMPERMEABLE_SURFACE";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "GRASS_COVERED_SURFACE";
    case "MINERAL_SOIL":
      return "PERMEABLE_SURFACE";
    default:
      return "IMPERMEABLE_SURFACE";
  }
};
