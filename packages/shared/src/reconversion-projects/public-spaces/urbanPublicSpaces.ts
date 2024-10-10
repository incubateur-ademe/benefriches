import z from "zod";

export const urbanPublicSpace = z.enum([
  "IMPERMEABLE_SURFACE",
  "PERMEABLE_SURFACE",
  "GRASS_COVERED_SURFACE",
]);

export type UrbanPublicSpace = z.infer<typeof urbanPublicSpace>;
