import { differenceInDays } from "date-fns";
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

export const getDurationFromScheduleInYears = ({ startDate, endDate }: Schedule) => {
  const durationInDays = differenceInDays(endDate, startDate);

  return durationInDays / 365;
};

export { reconversionProjectSchema, reconversionProjectPropsSchema };
