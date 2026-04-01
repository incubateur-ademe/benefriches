import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";

import { selectSiteData } from "../createProject.selectors";
import type { ExpressReconversionProjectResult } from "./demoProjectSaved.action";
import { DemoProjectCreationStep } from "./demoSteps.ts";

const selectSelf = (state: RootState) => state.projectCreation;

type DemoProjectSummaryViewData = {
  loadingState: "idle" | "loading" | "success" | "error";
  data: ExpressReconversionProjectResult | undefined;
  siteName: string;
};

export const selectDemoProjectSummaryViewData = createSelector(
  selectSelf,
  selectSiteData,
  (state, siteData): DemoProjectSummaryViewData => {
    const stepState = state.demoProject.steps.DEMO_PROJECT_SUMMARY;
    return {
      loadingState: stepState?.loadingState ?? "idle",
      data: stepState?.data,
      siteName: siteData?.name ?? "",
    };
  },
);

type DemoCreationResultViewData = {
  projectId: string;
  projectName: string;
  saveState: "idle" | "loading" | "success" | "error" | "dirty";
  shouldGoThroughOnboarding: boolean;
};

export const selectDemoCreationResultViewData = createSelector(
  selectSelf,
  selectShouldGoThroughOnboarding,
  (state, shouldGoThroughOnboarding): DemoCreationResultViewData => ({
    projectId: state.projectId,
    projectName: state.demoProject.steps.DEMO_PROJECT_SUMMARY?.data?.name ?? "",
    saveState: state.demoProject.saveState,
    shouldGoThroughOnboarding,
  }),
);

export const selectDemoProjectTemplateViewData = createSelector(selectSelf, (state) => ({
  hasStepBack: state.useCaseSelection.stepsSequence.length > 0,
  projectTemplate:
    state.demoProject.steps.DEMO_PROJECT_TEMPLATE_SELECTION?.payload?.projectTemplate,
}));

type DemoProjectCreationWizardViewData = {
  currentStep: DemoProjectCreationStep;
};
export const selectDemoProjectCreationWizardViewData = createSelector(
  selectSelf,
  (state): DemoProjectCreationWizardViewData => ({
    currentStep: state.demoProject.currentStep,
  }),
);

export const selectDemoProjectStepperViewData = createSelector(selectSelf, (state) => ({
  currentStep: state.demoProject.currentStep,
}));
