import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type BuildingsDeveloperViewData = {
  developerWillBeBuildingsConstructor: boolean | undefined;
  buildingsResalePlannedAfterDevelopment: boolean | undefined;
};

export const createSelectBuildingsDeveloperViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
) =>
  createSelector([selectStepState], (steps): BuildingsDeveloperViewData => {
    const answers = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
    );
    return {
      developerWillBeBuildingsConstructor: answers?.developerWillBeBuildingsConstructor,
      buildingsResalePlannedAfterDevelopment: answers?.buildingsResalePlannedAfterDevelopment,
    };
  });
