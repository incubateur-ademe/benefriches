import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type InvolvesReinstatementViewData = {
  initialValues: { involvesReinstatement: "yes" | "no" } | undefined;
};

export const createSelectInvolvesReinstatementViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(selectSteps, (steps): InvolvesReinstatementViewData => {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;
    return {
      initialValues:
        involvesReinstatement === undefined
          ? undefined
          : { involvesReinstatement: involvesReinstatement ? "yes" : "no" },
    };
  });
