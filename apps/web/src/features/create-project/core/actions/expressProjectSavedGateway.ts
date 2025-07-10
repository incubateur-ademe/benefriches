import {
  baseDevelopmentPlanSchema,
  photovoltaicPowerStationFeaturesSchema,
  reconversionProjectPropsSchema,
  urbanProjectsFeaturesSchema,
} from "shared";
import { z } from "zod";

export const saveExpressProjectSchema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
  category: z.enum([
    "PUBLIC_FACILITIES",
    "RESIDENTIAL_TENSE_AREA",
    "RESIDENTIAL_NORMAL_AREA",
    "NEW_URBAN_CENTER",
    "PHOTOVOLTAIC_POWER_PLANT",
  ]),
});
const commonDevelopmentPlanSchema = baseDevelopmentPlanSchema
  .omit({ installationSchedule: true })
  .extend({
    installationSchedule: z.object({ startDate: z.string(), endDate: z.string() }).optional(),
  });

export const saveExpressProjectResultSchema = reconversionProjectPropsSchema
  .omit({ developmentPlan: true, reinstatementSchedule: true })
  .extend({
    reinstatementSchedule: z.object({ startDate: z.string(), endDate: z.string() }).optional(),
    developmentPlan: z.discriminatedUnion("type", [
      commonDevelopmentPlanSchema.extend({
        type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
        features: photovoltaicPowerStationFeaturesSchema,
      }),
      commonDevelopmentPlanSchema.extend({
        type: z.literal("URBAN_PROJECT"),
        features: urbanProjectsFeaturesSchema,
      }),
    ]),
  });

export type ExpressReconversionProjectPayload = z.infer<typeof saveExpressProjectSchema>;
export type ReconversionProject = z.infer<typeof saveExpressProjectResultSchema>;

export interface SaveExpressReconversionProjectGateway {
  save(payload: ExpressReconversionProjectPayload): Promise<ReconversionProject>;
}
