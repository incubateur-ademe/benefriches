import { buildingsFloorAreaUsageDistribution, urbanProjectsSpaceSchema } from "shared";
import { z } from "zod";

export const urbanProjectsFeaturesSchema = z.object({
  spacesDistribution: urbanProjectsSpaceSchema,
  buildingsFloorAreaDistribution: buildingsFloorAreaUsageDistribution,
});

export type UrbanProjectFeatures = z.infer<typeof urbanProjectsFeaturesSchema>;
