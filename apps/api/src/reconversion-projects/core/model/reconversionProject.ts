import type {
  photovoltaicPowerStationFeaturesSchema,
  BaseReconversionProjectFeaturesView,
} from "shared";
import {
  httpSaveReconversionProjectSchema,
  httpSaveReconversionProjectPropsSchema,
  domainSaveReconversionProjectPropsSchema,
  ReconversionProjectSaveDto,
  ReconversionProjectSavePropsDto,
  ReconversionProjectUpdateDto,
  ReconversionProjectUpdatePropsDto,
  ReconversionProjectDataView,
} from "shared";
import type { z } from "zod";

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
  httpSaveReconversionProjectPropsSchema,
  httpSaveReconversionProjectSchema,
  domainSaveReconversionProjectPropsSchema,
  ReconversionProjectSaveDto,
  ReconversionProjectSavePropsDto,
  ReconversionProjectUpdateDto,
  ReconversionProjectUpdatePropsDto,
  ReconversionProjectDataView,
};
