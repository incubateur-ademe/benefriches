import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import type { RootState } from "@/shared/core/store-config/store";

export type SiteResaleRevenueViewData = {
  isPriceEstimated: boolean;
  initialSellingPrice: number | undefined;
  initialPropertyTransferDuties: number | undefined;
};

export const createSelectSiteResaleRevenueViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector([selectStepState], (steps): SiteResaleRevenueViewData => {
    const revenueAnswers =
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE") ??
      ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");

    return {
      isPriceEstimated: ReadStateHelper.isSiteResalePriceEstimated(steps),
      initialSellingPrice: revenueAnswers?.siteResaleExpectedSellingPrice,
      initialPropertyTransferDuties: revenueAnswers?.siteResaleExpectedPropertyTransferDuties,
    };
  });
