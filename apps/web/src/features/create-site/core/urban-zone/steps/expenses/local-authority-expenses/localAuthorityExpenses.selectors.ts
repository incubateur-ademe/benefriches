import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../stateHelpers";

export type LocalAuthorityExpensesViewData = {
  initialValues: {
    maintenance?: number;
    otherManagementCosts?: number;
  };
};

export const selectLocalAuthorityExpensesViewData = (
  state: RootState,
): LocalAuthorityExpensesViewData => {
  const stepsState = state.siteCreation.urbanZone.steps;
  const stored = ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES");
  return {
    initialValues: stored ?? {},
  };
};
