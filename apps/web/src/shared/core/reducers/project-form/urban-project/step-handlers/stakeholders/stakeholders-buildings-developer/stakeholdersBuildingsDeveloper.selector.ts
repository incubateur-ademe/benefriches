import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type BuildingsDeveloperViewData = {
  developerWillBeBuildingsConstructor: boolean | undefined;
};

export const createSelectBuildingsDeveloperViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
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
