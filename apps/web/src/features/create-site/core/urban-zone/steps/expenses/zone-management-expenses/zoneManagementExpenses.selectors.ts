import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../stateHelpers";

export type ZoneManagementExpensesViewData = {
  initialValues: {
    maintenance?: number;
    security?: number;
    illegalDumpingCost?: number;
    otherManagementCosts?: number;
  };
};

export const selectZoneManagementExpensesViewData = (
  state: RootState,
): ZoneManagementExpensesViewData => {
  const stepsState = state.siteCreation.urbanZone.steps;
  const stored = ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES");
  return {
    initialValues: stored ?? {},
  };
};
