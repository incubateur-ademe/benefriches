import { buildingsFloorAreaUsageDistribution, mixedUseNeighbourHoodSpaceSchema } from "shared";
import { z } from "zod";

export const mixedUseNeighbourhoodFeaturesSchema = z.object({
  spacesDistribution: mixedUseNeighbourHoodSpaceSchema,
  buildingsFloorAreaDistribution: buildingsFloorAreaUsageDistribution,
});

export type MixedUseNeighbourhoodFeatures = z.infer<typeof mixedUseNeighbourhoodFeaturesSchema>;
