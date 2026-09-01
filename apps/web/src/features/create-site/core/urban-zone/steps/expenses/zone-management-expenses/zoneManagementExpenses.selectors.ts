import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type ZoneManagementExpensesViewData = {
  initialValues: {
    maintenance?: number;
    security?: number;
    illegalDumpingCost?: number;
    otherManagementCosts?: number;
  };
};

export const createZoneManagementExpensesSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectZoneManagementExpensesViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): ZoneManagementExpensesViewData => {
      const stored = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES");
      return {
        initialValues: stored ?? {},
      };
    },
  );

  return { selectZoneManagementExpensesViewData };
};

export const { selectZoneManagementExpensesViewData } =
  createZoneManagementExpensesSelectors(siteCreationRootSelectors);
