import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { DecontaminationPlan } from "@/features/create-project/core/project-form/soilsDecontamination";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type SoilsDecontaminationViewData = {
  initialValues:
    | { decontaminationPlan: DecontaminationPlan; decontaminatedSurfaceArea: number | undefined }
    | undefined;
  contaminatedSoilSurface: number;
};

export const createSelectSoilsDecontaminationViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
  selectSiteContaminatedSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [selectStepState, selectSiteContaminatedSurfaceArea],
    (steps, contaminatedSoilSurface): SoilsDecontaminationViewData => {
      const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SOILS_DECONTAMINATION");
      return {
        initialValues: answers?.decontaminationPlan
          ? {
              decontaminationPlan: answers.decontaminationPlan,
              decontaminatedSurfaceArea: answers.decontaminatedSurfaceArea,
            }
          : undefined,
        contaminatedSoilSurface,
      };
    },
  );
