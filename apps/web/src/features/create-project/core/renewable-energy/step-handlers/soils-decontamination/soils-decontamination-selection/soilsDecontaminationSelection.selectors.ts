import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type SoilsDecontaminationSelectionViewData = {
  initialValues: { decontaminationSelection: "partial" | "none" | "unknown" | null };
};

export const createSelectSoilsDecontaminationSelectionViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(selectSteps, (steps): SoilsDecontaminationSelectionViewData => {
    const decontaminationPlan = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    )?.decontaminationPlan;

    return {
      initialValues: { decontaminationSelection: decontaminationPlan ?? null },
    };
  });
