import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { shouldSiteResalePriceBeEstimated } from "@/features/create-project/core/urban-project/helpers/readers/siteResaleReaders";
import type {
  UrbanProjectState,
  UrbanProjectStepsState,
} from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type SiteResaleRevenueViewData = {
  shouldSiteResalePriceBeEstimated: boolean;
  estimationFailed: boolean;
  initialSellingPrice: number | undefined;
  initialPropertyTransferDuties: number | undefined;
};

export const createSelectSiteResaleRevenueViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
  selectSiteResaleEstimationLoadingState: Selector<
    RootState,
    UrbanProjectState["siteResaleEstimationLoadingState"]
  >,
) =>
  createSelector(
    [selectStepState, selectSiteResaleEstimationLoadingState],
    (steps, siteResaleEstimationLoadingState): SiteResaleRevenueViewData => {
      const revenueAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");

      return {
        shouldSiteResalePriceBeEstimated: shouldSiteResalePriceBeEstimated(steps),
        estimationFailed: siteResaleEstimationLoadingState === "error",
        initialSellingPrice: revenueAnswers?.siteResaleExpectedSellingPrice,
        initialPropertyTransferDuties: revenueAnswers?.siteResaleExpectedPropertyTransferDuties,
      };
    },
  );
