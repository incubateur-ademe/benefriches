import z from "zod";

import { SoilType } from "../../../../soils";

export const livingAndActivitySpace = z.enum([
  "BUILDINGS",
  "IMPERMEABLE_SURFACE",
  "PERMEABLE_SURFACE",
  "PRIVATE_GREEN_SPACES",
]);

export type UrbanLivingAndActivitySpace = z.infer<typeof livingAndActivitySpace>;

export const getSoilTypeForLivingAndActivitySpace = (
  publicSpace: UrbanLivingAndActivitySpace,
): SoilType => {
  switch (publicSpace) {
    case "BUILDINGS":
      return "BUILDINGS";
    case "PRIVATE_GREEN_SPACES":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "PERMEABLE_SURFACE":
      return "MINERAL_SOIL";
    case "IMPERMEABLE_SURFACE":
      return "IMPERMEABLE_SOILS";
  }
};

export const getUrbanLivingAndActivitySpaceFromSoilType = (
  soilType: SoilType,
): UrbanLivingAndActivitySpace => {
  switch (soilType) {
    case "BUILDINGS":
      return "BUILDINGS";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "PRIVATE_GREEN_SPACES";
    case "MINERAL_SOIL":
      return "PERMEABLE_SURFACE";
    case "IMPERMEABLE_SOILS":
      return "IMPERMEABLE_SURFACE";
    default:
      return "IMPERMEABLE_SURFACE";
  }
};
