import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

import { getProjectBuildingsFootprint } from "../buildingsReaders";

type BuildingsNewConstructionIntroductionViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionIntroductionViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): BuildingsNewConstructionIntroductionViewData => ({
      buildingsFootprintToConstruct: getProjectBuildingsFootprint(stepsState),
    }),
  );
