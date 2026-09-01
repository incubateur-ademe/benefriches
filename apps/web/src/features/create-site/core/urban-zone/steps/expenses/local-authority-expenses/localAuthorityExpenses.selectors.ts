import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

export type LocalAuthorityExpensesViewData = {
  initialValues: {
    maintenance?: number;
    otherManagementCosts?: number;
  };
};

export const createLocalAuthorityExpensesSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectLocalAuthorityExpensesViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): LocalAuthorityExpensesViewData => {
      const stored = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES");
      return {
        initialValues: stored ?? {},
      };
    },
  );

  return { selectLocalAuthorityExpensesViewData };
};

export const { selectLocalAuthorityExpensesViewData } =
  createLocalAuthorityExpensesSelectors(siteCreationRootSelectors);
