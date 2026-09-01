import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type ZoneManagementIncomeViewData = {
  initialValues: {
    rent?: number;
    subsidies?: number;
    otherIncome?: number;
  };
};

export const createZoneManagementIncomeSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectZoneManagementIncomeViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): ZoneManagementIncomeViewData => {
      const stored = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_ZONE_MANAGEMENT_INCOME");
      return {
        initialValues: stored ?? {},
      };
    },
  );

  return { selectZoneManagementIncomeViewData };
};

export const { selectZoneManagementIncomeViewData } =
  createZoneManagementIncomeSelectors(siteCreationRootSelectors);
