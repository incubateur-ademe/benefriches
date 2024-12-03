import {
  reconversionProjectSchema,
  reconversionProjectPropsSchema,
  developmentPlanSchema,
  photovoltaicPowerStationFeaturesSchema,
} from "shared";
import { z } from "zod";

export type PhotovoltaicPowerStationFeatures = z.infer<
  typeof photovoltaicPowerStationFeaturesSchema
>;

export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;

export type ReconversionProject = z.infer<typeof reconversionProjectSchema>;

export type Schedule = {
  startDate: Date;
  endDate: Date;
};

export { reconversionProjectSchema, reconversionProjectPropsSchema };
