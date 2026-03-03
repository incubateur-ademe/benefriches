import { createSelector } from "@reduxjs/toolkit";

import { computePercentage } from "@/shared/core/percentage/percentage";

import {
  selectSiteContaminatedSurfaceArea,
  selectSiteData,
} from "../../../createProject.selectors";
import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

const selectContaminatedSurfaceAreaPercentageToDecontaminate = createSelector(
  [selectSteps, selectSiteData],
  (steps, siteData) => {
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const surfaceAreaStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const surfaceToDecontaminate =
      surfaceAreaStep?.decontaminatedSurfaceArea ??
      decontaminationSelection?.decontaminatedSurfaceArea;
    const contaminatedSurfaceArea = siteData?.contaminatedSoilSurface;
    if (!contaminatedSurfaceArea || !surfaceToDecontaminate) return 0;

    return computePercentage(surfaceToDecontaminate, contaminatedSurfaceArea);
  },
);

type PVDecontaminationSurfaceAreaViewData = {
  contaminatedSurfaceArea: number;
  surfaceAreaToDecontaminateInPercentage: number;
};

export const selectPVDecontaminationSurfaceAreaViewData = createSelector(
  [selectSiteContaminatedSurfaceArea, selectContaminatedSurfaceAreaPercentageToDecontaminate],
  (
    contaminatedSurfaceArea,
    surfaceAreaToDecontaminateInPercentage,
  ): PVDecontaminationSurfaceAreaViewData => ({
    contaminatedSurfaceArea,
    surfaceAreaToDecontaminateInPercentage,
  }),
);
