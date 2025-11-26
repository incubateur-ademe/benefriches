import z from "zod";

import { developmentPlanTypeSchema } from "../../reconversion-projects";
import { siteActionStatusSchema, siteActionTypeSchema } from "../../siteActions";
import { getSiteFeaturesResponseDtoSchema } from "./getSiteFeatures.dto";

export const getSiteViewResponseDtoSchema = z.object({
  id: z.string(),
  features: getSiteFeaturesResponseDtoSchema,
  actions: z.array(
    z.object({
      action: siteActionTypeSchema,
      status: siteActionStatusSchema,
    }),
  ),
  reconversionProjects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: developmentPlanTypeSchema,
    }),
  ),
});

export type GetSiteViewResponseDto = z.infer<typeof getSiteViewResponseDtoSchema>;
