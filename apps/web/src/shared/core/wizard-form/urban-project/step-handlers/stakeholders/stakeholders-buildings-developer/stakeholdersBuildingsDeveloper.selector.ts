import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

type BuildingsDeveloperViewData = {
  developerWillBeBuildingsConstructor: boolean | undefined;
};

export const createSelectBuildingsDeveloperViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (steps): BuildingsDeveloperViewData => ({
      developerWillBeBuildingsConstructor: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
      )?.developerWillBeBuildingsConstructor,
    }),
  );
