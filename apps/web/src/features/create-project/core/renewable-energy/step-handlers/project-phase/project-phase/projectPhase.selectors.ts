import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

type ProjectPhaseViewData = {
  initialValues: { phase: string } | undefined;
};

export const selectProjectPhaseViewData = createSelector(
  selectSteps,
  (steps): ProjectPhaseViewData => {
    const phase = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PROJECT_PHASE")?.phase;

    return {
      initialValues: phase !== undefined ? { phase } : undefined,
    };
  },
);
