import type { UrbanZoneLandParcelType } from "shared";

import { getSelectedParcelTypes, ReadStateHelper } from "../../helpers/stateHelpers";
import type { AnswerStepHandler } from "../../step-handlers/stepHandler.type";
import {
  type ParcelBuildingsFloorAreaStepId,
  type ParcelSoilsDistributionStepId,
  getNextParcelType,
  getParcelStepIds,
  getPreviousParcelType,
} from "./parcelStepMapping";

export function createParcelSoilsDistributionHandler(
  parcelType: UrbanZoneLandParcelType,
): AnswerStepHandler<ParcelSoilsDistributionStepId> {
  const parcelStepIds = getParcelStepIds(parcelType);

  return {
    stepId: parcelStepIds.soilsDistribution,

    getNextStepId(context, answers?) {
      const hasBuildingsInSoils = answers
        ? Object.keys(answers.soilsDistribution).includes("BUILDINGS")
        : false;

      if (hasBuildingsInSoils) {
        return parcelStepIds.buildingsFloorArea;
      }

      const selectedTypes = getSelectedParcelTypes(context.stepsState);
      const nextType = getNextParcelType(selectedTypes, parcelType);
      if (nextType) {
        return getParcelStepIds(nextType).soilsDistribution;
      }
      return "URBAN_ZONE_SOILS_SUMMARY";
    },

    getPreviousStepId(context) {
      const selectedTypes = getSelectedParcelTypes(context.stepsState);
      const prevType = getPreviousParcelType(selectedTypes, parcelType);
      if (prevType) {
        // Go back to previous parcel's last step
        const prevStepIds = getParcelStepIds(prevType);
        const prevStep = ReadStateHelper.getStep(
          context.stepsState,
          prevStepIds.buildingsFloorArea,
        );
        return prevStep?.completed ? prevStepIds.buildingsFloorArea : prevStepIds.soilsDistribution;
      }
      return "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION";
    },

    getDefaultAnswers(context) {
      const stepState = ReadStateHelper.getDefaultAnswers(
        context.stepsState,
        parcelStepIds.soilsDistribution,
      );
      return stepState;
    },
  };
}

export function createParcelBuildingsFloorAreaHandler(
  parcelType: UrbanZoneLandParcelType,
): AnswerStepHandler<ParcelBuildingsFloorAreaStepId> {
  const stepIds = getParcelStepIds(parcelType);

  return {
    stepId: stepIds.buildingsFloorArea,

    getNextStepId(context) {
      const selectedTypes = getSelectedParcelTypes(context.stepsState);
      const nextType = getNextParcelType(selectedTypes, parcelType);
      if (nextType) {
        return getParcelStepIds(nextType).soilsDistribution;
      }
      return "URBAN_ZONE_SOILS_SUMMARY";
    },

    getPreviousStepId() {
      return stepIds.soilsDistribution;
    },

    getDefaultAnswers(context) {
      const stepState = ReadStateHelper.getDefaultAnswers(
        context.stepsState,
        stepIds.buildingsFloorArea,
      );
      return stepState;
    },
  };
}
