import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

export const selectDemoUseCaseContentWizardViewData = createSelector(
  (state: RootState) => state.siteCreation,
  (state) => {
    return { currentStep: state.demo.currentStep, saveState: state.demo.saveState };
  },
);

export const selectDemoCurrentStep = createSelector(
  (state: RootState) => state.siteCreation.demo,
  (demoState) => {
    return demoState.currentStep;
  },
);
