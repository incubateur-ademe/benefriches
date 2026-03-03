import { createSelector } from "@reduxjs/toolkit";
import type { ReinstatementExpense, SoilsDistribution } from "shared";

import { selectSiteData } from "../../../../createProject.selectors";
import { ReadStateHelper } from "../../../helpers/readState";
import {
  selectProjectSoilsDistribution,
  selectSteps,
} from "../../../selectors/renewableEnergy.selector";

type PVReinstatementExpensesViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
  decontaminatedSurfaceArea: number;
  reinstatementExpenses: ReinstatementExpense[] | undefined;
};

export const selectPVReinstatementExpensesViewData = createSelector(
  [selectSiteData, selectSteps, selectProjectSoilsDistribution],
  (siteData, steps, projectSoilsDistribution): PVReinstatementExpensesViewData => {
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const decontaminationSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const reinstatementStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
    );
    return {
      siteSoilsDistribution: siteData?.soilsDistribution ?? {},
      projectSoilsDistribution,
      decontaminatedSurfaceArea:
        decontaminationSurface?.decontaminatedSurfaceArea ??
        decontaminationSelection?.decontaminatedSurfaceArea ??
        0,
      reinstatementExpenses: reinstatementStep?.reinstatementExpenses,
    };
  },
);
