import z from "zod";

import { projectStakeholderSchema } from "../shared/projectStakeholder.schema";

export const stakeholdersFutureOperatorSchema = z.object({
  futureOperator: projectStakeholderSchema,
});
