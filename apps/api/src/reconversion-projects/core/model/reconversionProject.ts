import {
  reconversionProjectSchema,
  saveReconversionProjectSchema,
  saveReconversionProjectPropsSchema,
  developmentPlanSchema,
  photovoltaicPowerStationFeaturesSchema,
} from "shared";
import { z } from "zod";

export type PhotovoltaicPowerStationFeatures = z.infer<
  typeof photovoltaicPowerStationFeaturesSchema
>;

export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;

export type ReconversionProjectView = z.infer<typeof reconversionProjectSchema>;
export type ReconversionProjectInput = z.infer<typeof saveReconversionProjectSchema>;
export type ReconversionProjectInputProps = z.infer<typeof saveReconversionProjectPropsSchema>;

export type Schedule = {
  startDate: Date;
  endDate: Date;
};

export {
  reconversionProjectSchema,
  saveReconversionProjectPropsSchema,
  saveReconversionProjectSchema,
};
