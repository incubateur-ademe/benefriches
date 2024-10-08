import z from "zod";

export const urbanGreenSpaces = z.enum([
  "LAWNS_AND_BUSHES",
  "TREE_FILLED_SPACE",
  "URBAN_POND_OR_LAKE",
  "PAVED_ALLEY",
  "GRAVEL_ALLEY",
]);

export type UrbanGreenSpace = z.infer<typeof urbanGreenSpaces>;
