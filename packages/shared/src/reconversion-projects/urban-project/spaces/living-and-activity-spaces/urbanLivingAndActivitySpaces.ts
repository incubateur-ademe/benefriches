import z from "zod";

import { SoilType } from "../../../../soils";

export const livingAndActivitySpace = z.enum([
  "BUILDINGS",
  "PAVED_ALLEY_OR_PARKING_LOT",
  "GRAVEL_ALLEY_OR_PARKING_LOT",
  "GARDEN_AND_GRASS_ALLEYS",
  "TREE_FILLED_GARDEN_OR_ALLEY",
]);

export type UrbanLivingAndActivitySpace = z.infer<typeof livingAndActivitySpace>;

export const getSoilTypeForLivingAndActivitySpace = (
  publicSpace: UrbanLivingAndActivitySpace,
): SoilType => {
  switch (publicSpace) {
    case "BUILDINGS":
      return "BUILDINGS";
    case "GARDEN_AND_GRASS_ALLEYS":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "GRAVEL_ALLEY_OR_PARKING_LOT":
      return "MINERAL_SOIL";
    case "PAVED_ALLEY_OR_PARKING_LOT":
      return "IMPERMEABLE_SOILS";
    case "TREE_FILLED_GARDEN_OR_ALLEY":
      return "ARTIFICIAL_TREE_FILLED";
  }
};
