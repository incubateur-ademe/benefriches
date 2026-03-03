import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

type SoilsDecontaminationSelectionViewData = {
  initialValues: { decontaminationSelection: "partial" | "none" | "unknown" | null };
};

export const selectSoilsDecontaminationSelectionViewData = createSelector(
  selectSteps,
  (steps): SoilsDecontaminationSelectionViewData => {
    const decontaminationPlan = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    )?.decontaminationPlan;

    return {
      initialValues: { decontaminationSelection: decontaminationPlan ?? null },
    };
  },
);
