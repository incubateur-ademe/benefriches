import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../stateHelpers";

export type ZoneManagementIncomeViewData = {
  initialValues: {
    rent?: number;
    subsidies?: number;
    otherIncome?: number;
  };
};

export const selectZoneManagementIncomeViewData = (
  state: RootState,
): ZoneManagementIncomeViewData => {
  const stepsState = state.siteCreation.urbanZone.steps;
  const stored = ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_ZONE_MANAGEMENT_INCOME");
  return {
    initialValues: stored ?? {},
  };
};
