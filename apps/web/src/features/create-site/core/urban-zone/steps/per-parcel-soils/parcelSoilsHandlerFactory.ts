import type { UrbanZoneLandParcelType } from "shared";

import { getSelectedParcelTypes, ReadStateHelper } from "../../stateHelpers";
import type { UrbanZoneAnswerStepHandler } from "../../stepHandlerRegistry";
import {
  PARCEL_STEP_IDS,
  getNextParcelType,
  getParcelStepIds,
  getPreviousParcelType,
} from "./parcelStepMapping";

type SoilsDistributionStepId<P extends UrbanZoneLandParcelType> =
  (typeof PARCEL_STEP_IDS)[P]["soilsDistribution"];
type BuildingsFloorAreaStepId<P extends UrbanZoneLandParcelType> =
  (typeof PARCEL_STEP_IDS)[P]["buildingsFloorArea"];

export function createParcelSoilsDistributionHandler<P extends UrbanZoneLandParcelType>(
  parcelType: P,
): UrbanZoneAnswerStepHandler<SoilsDistributionStepId<P>> {
  const parcelStepIds = getParcelStepIds(parcelType);

  return {
    stepId: parcelStepIds.soilsDistribution,

    getNextStepId(params, answers?) {
      const hasBuildingsInSoils = answers
        ? Object.keys(answers.soilsDistribution).includes("BUILDINGS")
        : false;

      if (hasBuildingsInSoils) {
        return parcelStepIds.buildingsFloorArea;
      }

      const selectedTypes = getSelectedParcelTypes(params.answers);
      const nextType = getNextParcelType(selectedTypes, parcelType);
      if (nextType) {
        return getParcelStepIds(nextType).soilsDistribution;
      }
      return "URBAN_ZONE_SOILS_SUMMARY";
    },

    getPreviousStepId(params) {
      const selectedTypes = getSelectedParcelTypes(params.answers);
      const prevType = getPreviousParcelType(selectedTypes, parcelType);
      if (prevType) {
        const prevStepIds = getParcelStepIds(prevType);
        const prevStep = ReadStateHelper.getStep(params.answers, prevStepIds.buildingsFloorArea);
        return prevStep?.completed ? prevStepIds.buildingsFloorArea : prevStepIds.soilsDistribution;
      }
      return "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION";
    },

    getDefaultAnswers(params) {
      const stepState = ReadStateHelper.getDefaultAnswers(
        params.answers,
        parcelStepIds.soilsDistribution,
      );
      return stepState;
    },
  };
}

export function createParcelBuildingsFloorAreaHandler<P extends UrbanZoneLandParcelType>(
  parcelType: P,
): UrbanZoneAnswerStepHandler<BuildingsFloorAreaStepId<P>> {
  const stepIds = getParcelStepIds(parcelType);

  return {
    stepId: stepIds.buildingsFloorArea,

    getNextStepId(params) {
      const selectedTypes = getSelectedParcelTypes(params.answers);
      const nextType = getNextParcelType(selectedTypes, parcelType);
      if (nextType) {
        return getParcelStepIds(nextType).soilsDistribution;
      }
      return "URBAN_ZONE_SOILS_SUMMARY";
    },

    getPreviousStepId() {
      return stepIds.soilsDistribution;
    },

    getDefaultAnswers(params) {
      const stepState = ReadStateHelper.getDefaultAnswers(
        params.answers,
        stepIds.buildingsFloorArea,
      );
      return stepState;
    },
  };
}
