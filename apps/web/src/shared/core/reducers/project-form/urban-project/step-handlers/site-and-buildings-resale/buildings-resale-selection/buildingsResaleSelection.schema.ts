import z from "zod";

import { projectStakeholderSchema } from "../../shared/projectStakeholder.schema";

export const buildingsResaleSelectionSchema = z.object({
  buildingsResalePlannedAfterDevelopment: z.boolean(),
  futureOperator: projectStakeholderSchema.optional(),
});
