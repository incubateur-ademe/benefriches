import {
  saveReconversionProjectSchema,
  saveReconversionProjectPropsSchema,
  developmentPlanSchema,
  photovoltaicPowerStationFeaturesSchema,
  BaseReconversionProjectFeaturesView,
  updateReconversionProjectPropsSchema,
} from "shared";
import { z } from "zod";

export type PhotovoltaicPowerStationFeatures = z.infer<
  typeof photovoltaicPowerStationFeaturesSchema
>;

export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;

export type ReconversionProjectInput = z.infer<typeof saveReconversionProjectSchema>;
export type ReconversionProjectUpdateInput = ReconversionProjectUpdateInputProps & {
  updatedAt: Date;
  id: string;
};
export type ReconversionProjectUpdateInputProps = z.infer<
  typeof updateReconversionProjectPropsSchema
>;
export type ReconversionProjectInputProps = z.infer<typeof saveReconversionProjectPropsSchema>;

export type Schedule = {
  startDate: Date;
  endDate: Date;
};
export type ReconversionProjectFeaturesView = BaseReconversionProjectFeaturesView<Schedule>;

export { saveReconversionProjectPropsSchema, saveReconversionProjectSchema };
