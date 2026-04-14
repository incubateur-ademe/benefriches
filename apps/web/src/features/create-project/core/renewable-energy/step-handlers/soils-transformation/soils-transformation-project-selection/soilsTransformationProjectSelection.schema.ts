import { soilsDistributionSchema } from "shared";
import z from "zod";

import { soilsTransformationProjectSchema } from "../../shared/soils.schema";

export const soilsTransformationProjectSelectionSchema = z.object({
  soilsTransformationProject: soilsTransformationProjectSchema,
  soilsDistribution: soilsDistributionSchema.optional(),
});
