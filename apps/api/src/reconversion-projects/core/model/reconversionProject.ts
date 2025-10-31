import {
  saveReconversionProjectSchema,
  saveReconversionProjectPropsSchema,
  photovoltaicPowerStationFeaturesSchema,
  BaseReconversionProjectFeaturesView,
  ReconversionProjectSaveDto,
  ReconversionProjectSavePropsDto,
  ReconversionProjectUpdateDto,
  ReconversionProjectUpdatePropsDto,
  ReconversionProjectDataView,
} from "shared";
import { z } from "zod";

export type PhotovoltaicPowerStationFeatures = z.infer<
  typeof photovoltaicPowerStationFeaturesSchema
>;

export type DevelopmentPlan = ReconversionProjectDataView["developmentPlan"];

export type Schedule = {
  startDate: Date;
  endDate: Date;
};
export type ReconversionProjectFeaturesView = BaseReconversionProjectFeaturesView<Schedule>;

export {
  saveReconversionProjectPropsSchema,
  saveReconversionProjectSchema,
  ReconversionProjectSaveDto,
  ReconversionProjectSavePropsDto,
  ReconversionProjectUpdateDto,
  ReconversionProjectUpdatePropsDto,
  ReconversionProjectDataView,
};
