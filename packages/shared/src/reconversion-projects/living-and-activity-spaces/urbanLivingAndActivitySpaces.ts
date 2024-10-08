import z from "zod";

export const livingAndActivitySpace = z.enum([
  "BUILDINGS",
  "PAVED_ALLEY_OR_PARKING_LOT",
  "GRAVEL_ALLEY_OR_PARKING_LOT",
  "GARDEN_AND_GRASS_ALLEYS",
  "TREE_FILLED_GARDEN_OR_ALLEY",
]);

export type UrbanLivingAndActivitySpace = z.infer<typeof livingAndActivitySpace>;
