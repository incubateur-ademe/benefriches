import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
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

export const createVacantPremisesExpensesSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectVacantPremisesExpensesViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): VacantPremisesExpensesViewData => {
      const stored = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_VACANT_PREMISES_EXPENSES");
      return {
        initialValues: stored ?? {},
      };
    },
  );

  return { selectVacantPremisesExpensesViewData };
};

export const { selectVacantPremisesExpensesViewData } =
  createVacantPremisesExpensesSelectors(siteCreationRootSelectors);
