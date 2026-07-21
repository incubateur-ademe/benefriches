import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";

import type { ProjectStakeholder } from "../../../../project.types";
import { ReadStateHelper } from "../../../helpers/readState";

type PVOperatorViewData = {
  currentUser: ReturnType<typeof selectCurrentUserStructure>;
  initialValue: ProjectStakeholder | undefined;
};

export const createSelectPVOperatorViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(
    [selectCurrentUserStructure, selectSteps],
    (currentUser, steps): PVOperatorViewData => ({
      currentUser,
      initialValue: ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
      )?.futureOperator,
    }),
  );
