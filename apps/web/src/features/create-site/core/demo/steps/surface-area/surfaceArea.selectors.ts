import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../demoFactory";

export const selectSiteSurfaceAreaFormViewData = createSelector(
  (state: RootState) => state.siteCreation.demo.steps,
  (demoSteps) => ({
    initialValues: ReadStateHelper.getStepAnswers(demoSteps, "DEMO_SITE_SURFACE_AREA"),
    siteNature: ReadStateHelper.getStepAnswers(demoSteps, "DEMO_SITE_NATURE_SELECTION")?.siteNature,
  }),
);
