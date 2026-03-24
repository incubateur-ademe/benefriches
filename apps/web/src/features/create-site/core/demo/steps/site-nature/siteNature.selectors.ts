import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../demoFactory";

export const selectSiteNatureViewData = createSelector(
  (state: RootState) => state.siteCreation.demo,
  (demoState) => ({
    initialValues: ReadStateHelper.getStepAnswers(demoState.steps, "DEMO_SITE_NATURE_SELECTION"),
  }),
);
