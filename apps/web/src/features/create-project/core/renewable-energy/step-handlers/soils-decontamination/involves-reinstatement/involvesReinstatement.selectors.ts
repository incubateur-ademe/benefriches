import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

type InvolvesReinstatementViewData = {
  initialValues: { involvesReinstatement: "yes" | "no" } | undefined;
};

export const selectInvolvesReinstatementViewData = createSelector(
  selectSteps,
  (steps): InvolvesReinstatementViewData => {
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
  },
);
