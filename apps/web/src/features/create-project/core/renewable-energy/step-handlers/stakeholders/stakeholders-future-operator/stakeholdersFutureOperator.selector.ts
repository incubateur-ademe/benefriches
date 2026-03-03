import { createSelector } from "@reduxjs/toolkit";

import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";

import type { ProjectStakeholder } from "../../../../project.types";
import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

type PVOperatorViewData = {
  currentUser: ReturnType<typeof selectCurrentUserStructure>;
  initialValue: ProjectStakeholder | undefined;
};

export const selectPVOperatorViewData = createSelector(
  [selectCurrentUserStructure, selectSteps],
  (currentUser, steps): PVOperatorViewData => ({
    currentUser,
    initialValue: ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator,
  }),
);
