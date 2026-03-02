import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { ReinstatementExpensePurpose, SoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type ReinstatementExpensesViewData = {
  reinstatementExpenses: { amount: number; purpose: ReinstatementExpensePurpose }[] | undefined;
  decontaminatedSurfaceArea: number | undefined;
  siteSoilsDistribution: SoilsDistribution;
};

export const createSelectReinstatementExpensesViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectStepState, selectSiteSoilsDistribution],
    (steps, siteSoilsDistribution): ReinstatementExpensesViewData => ({
      reinstatementExpenses: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      )?.reinstatementExpenses,
      decontaminatedSurfaceArea: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
      )?.decontaminatedSurfaceArea,
      siteSoilsDistribution,
    }),
  );
