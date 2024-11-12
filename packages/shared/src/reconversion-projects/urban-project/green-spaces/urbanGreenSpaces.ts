import z from "zod";

import { SoilType } from "../../../soils";

export const urbanGreenSpaces = z.enum([
  "LAWNS_AND_BUSHES",
  "TREE_FILLED_SPACE",
  "URBAN_POND_OR_LAKE",
  "PAVED_ALLEY",
  "GRAVEL_ALLEY",
]);

export type UrbanGreenSpace = z.infer<typeof urbanGreenSpaces>;

export const getSoilTypeForUrbanGreenSpace = (publicSpace: UrbanGreenSpace): SoilType => {
  switch (publicSpace) {
    case "GRAVEL_ALLEY":
      return "MINERAL_SOIL";
    case "LAWNS_AND_BUSHES":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "PAVED_ALLEY":
      return "IMPERMEABLE_SOILS";
    case "TREE_FILLED_SPACE":
      return "ARTIFICIAL_TREE_FILLED";
    case "URBAN_POND_OR_LAKE":
      return "WATER";
  }
};
