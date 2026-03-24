import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

import { DemoSiteCreationStep } from "./demoSteps";

export const selectDemoUseCaseContentWizardViewData = createSelector(
  [(state: RootState) => state.siteCreation],
  (
    state,
  ): { currentStep: DemoSiteCreationStep; saveState: "idle" | "success" | "error" | "loading" } => {
    return { currentStep: state.demo.currentStep, saveState: state.demo.saveState };
  },
);
