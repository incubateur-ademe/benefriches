import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

type SiteImpactsIntroductionViewData = {
  showsAvoidedCosts: boolean;
};

export const selectSiteImpactsIntroductionViewData = createSelector(
  (state: RootState) => state.siteCreation.nature,
  (nature): SiteImpactsIntroductionViewData => ({
    showsAvoidedCosts: nature === "FRICHE",
  }),
);
