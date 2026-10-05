import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { DecontaminationPlan } from "@/features/create-project/core/project-form/soilsDecontamination";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type SoilsDecontaminationViewData = {
  initialValues:
    | { decontaminationPlan: DecontaminationPlan; decontaminatedSurfaceArea: number | undefined }
    | undefined;
  contaminatedSoilSurface: number;
};

export const createSelectSoilsDecontaminationViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteContaminatedSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [selectSteps, selectSiteContaminatedSurfaceArea],
    (steps, contaminatedSoilSurface): SoilsDecontaminationViewData => {
      const answers = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
      );
      return {
        initialValues: answers
          ? {
              decontaminationPlan: answers.decontaminationPlan,
              decontaminatedSurfaceArea: answers.decontaminatedSurfaceArea,
            }
          : undefined,
        contaminatedSoilSurface,
      };
    },
  );
