import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

import { getBuildingsFootprintToConstruct } from "../buildingsReaders";

type BuildingsNewConstructionInfoViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionInfoViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): BuildingsNewConstructionInfoViewData => ({
      buildingsFootprintToConstruct: getBuildingsFootprintToConstruct(stepsState),
    }),
  );
