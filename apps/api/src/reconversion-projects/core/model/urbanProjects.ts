import { buildingsUseSurfaceAreaDistributionSchema, urbanProjectsSpaceSchema } from "shared";
import { z } from "zod";

export const urbanProjectsFeaturesSchema = z.object({
  spacesDistribution: urbanProjectsSpaceSchema,
  buildingsFloorAreaDistribution: buildingsUseSurfaceAreaDistributionSchema,
});

export type UrbanProjectFeatures = z.infer<typeof urbanProjectsFeaturesSchema>;
