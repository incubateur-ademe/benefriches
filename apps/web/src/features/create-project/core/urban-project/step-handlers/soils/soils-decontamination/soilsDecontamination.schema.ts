import { surfaceAreaSchema } from "shared";
import z from "zod";

import { decontaminationPlanSchema } from "@/features/create-project/core/project-form/soilsDecontamination";

// The surface is always stored with the plan (resolved by the handler's middleware):
// 0 for "none", the 25% default for "unknown", the user input for "partial".
export const soilsDecontaminationSchema = z.object({
  decontaminationPlan: decontaminationPlanSchema,
  decontaminatedSurfaceArea: surfaceAreaSchema,
});
