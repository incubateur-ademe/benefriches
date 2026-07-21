import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectSiteView } from "@/features/create-project/core/project-form/projectSite.types";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";
import { computePercentage } from "@/shared/core/percentage/percentage";

import { ReadStateHelper } from "../../../helpers/readState";

const createSelectContaminatedSurfaceAreaPercentageToDecontaminate = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteData: Selector<RootState, ProjectSiteView | undefined>,
) =>
  createSelector([selectSteps, selectSiteData], (steps, siteData) => {
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
  });

type PVDecontaminationSurfaceAreaViewData = {
  contaminatedSurfaceArea: number;
  surfaceAreaToDecontaminateInPercentage: number;
};

export const createSelectPVDecontaminationSurfaceAreaViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteData: Selector<RootState, ProjectSiteView | undefined>,
  selectSiteContaminatedSurfaceArea: Selector<RootState, number>,
) => {
  const selectContaminatedSurfaceAreaPercentageToDecontaminate =
    createSelectContaminatedSurfaceAreaPercentageToDecontaminate(selectSteps, selectSiteData);

  return createSelector(
    [selectSiteContaminatedSurfaceArea, selectContaminatedSurfaceAreaPercentageToDecontaminate],
    (
      contaminatedSurfaceArea,
      surfaceAreaToDecontaminateInPercentage,
    ): PVDecontaminationSurfaceAreaViewData => ({
      contaminatedSurfaceArea,
      surfaceAreaToDecontaminateInPercentage,
    }),
  );
};
