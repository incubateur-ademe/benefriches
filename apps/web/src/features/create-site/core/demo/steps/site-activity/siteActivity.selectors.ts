import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../demoFactory";

export const selectSiteActivityViewData = createSelector(
  (state: RootState) => state.siteCreation.demo.steps,
  (demoSteps) => {
    const siteNature = ReadStateHelper.getStepAnswers(
      demoSteps,
      "DEMO_SITE_NATURE_SELECTION",
    )?.siteNature;
    const stepAnswer = ReadStateHelper.getStepAnswers(demoSteps, "DEMO_SITE_ACTIVITY_SELECTION");

    switch (siteNature) {
      case "AGRICULTURAL_OPERATION":
        return {
          siteNature,
          agriculturalOperationActivity:
            stepAnswer?.siteNature === siteNature
              ? stepAnswer.agriculturalOperationActivity
              : undefined,
        };
      case "NATURAL_AREA":
        return {
          siteNature,
          naturalAreaType:
            stepAnswer?.siteNature === siteNature ? stepAnswer.naturalAreaType : undefined,
        };
      case "FRICHE":
        return {
          siteNature,
          fricheActivity:
            stepAnswer?.siteNature === siteNature ? stepAnswer.fricheActivity : undefined,
        };
      default:
        return { siteNature: undefined };
    }
  },
);
