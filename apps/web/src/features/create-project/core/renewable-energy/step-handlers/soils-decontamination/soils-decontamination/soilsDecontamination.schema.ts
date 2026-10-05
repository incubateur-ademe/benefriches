import { surfaceAreaSchema } from "shared";
import z from "zod";

import { decontaminationPlanSchema } from "@/features/create-project/core/project-form/soilsDecontamination";

// The form only sends the surface for "partial" (hence optional in the answers type); the
// handler's middleware then stores the resolved surface with every plan: 0 for "none", the 25%
// default for "unknown". A stored answer without a surface is therefore invalid.
export const soilsDecontaminationSchema = z
  .object({
    decontaminationPlan: decontaminationPlanSchema,
    decontaminatedSurfaceArea: surfaceAreaSchema.optional(),
  })
  .refine((answers) => answers.decontaminatedSurfaceArea !== undefined, {
    path: ["decontaminatedSurfaceArea"],
  });
