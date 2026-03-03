import z from "zod";

import {
  soilsDistributionSchema,
  soilsTransformationProjectSchema,
} from "../../shared/soils.schema";

export const soilsTransformationProjectSelectionSchema = z.object({
  soilsTransformationProject: soilsTransformationProjectSchema,
  soilsDistribution: soilsDistributionSchema.optional(),
});
