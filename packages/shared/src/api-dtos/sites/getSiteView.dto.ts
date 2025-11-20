import z from "zod";

import { developmentPlanTypeSchema } from "../../reconversion-projects";
import { getSiteFeaturesResponseDtoSchema } from "./getSiteFeatures.dto";

export const getSiteViewResponseDtoSchema = z.object({
  id: z.string(),
  features: getSiteFeaturesResponseDtoSchema,
  reconversionProjects: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: developmentPlanTypeSchema,
      }),
    )
    .default([]),
});

export type GetSiteViewResponseDto = z.infer<typeof getSiteViewResponseDtoSchema>;
