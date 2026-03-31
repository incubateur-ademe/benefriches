import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../stateHelpers";

type VacantPremisesExpensesViewData = {
  initialValues: {
    ownerPropertyTaxes?: number;
    ownerMaintenance?: number;
    ownerSecurity?: number;
    ownerIllegalDumpingCost?: number;
    ownerOtherManagementCosts?: number;
    tenantRent?: number;
    tenantOperationsTaxes?: number;
    tenantOtherOperationsCosts?: number;
  };
};

export const selectVacantPremisesExpensesViewData = (
  state: RootState,
): VacantPremisesExpensesViewData => {
  const stepsState = state.siteCreation.urbanZone.steps;
  const stored = ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_VACANT_PREMISES_EXPENSES");
  return {
    initialValues: stored ?? {},
  };
};
