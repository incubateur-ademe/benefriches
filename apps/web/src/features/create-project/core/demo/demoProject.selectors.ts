import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";

import { ProjectCreationState } from "../createProject.reducer.ts";
import { selectSiteData } from "../createProject.selectors";
import type { ExpressReconversionProjectResult } from "./demoProject.actions.ts";
import { DEMO_INITIAL_STATE } from "./demoProject.reducer.ts";
import {
  DEMO_STEP_GROUP_IDS,
  DEMO_STEP_GROUP_LABELS,
  DEMO_STEP_TO_GROUP,
} from "./demoStepperConfig.ts";
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

type DemoProjectStepperViewData = {
  currentStep: DemoProjectCreationStep;
  currentProjectFlow: ProjectCreationState["currentProjectFlow"];
  stepCategories: { title: string; targetStepId: DemoProjectCreationStep }[];
};
export const selectDemoProjectStepperViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state): DemoProjectStepperViewData => {
    const stepCategories = DEMO_STEP_GROUP_IDS.map((groupId) => ({
      title: DEMO_STEP_GROUP_LABELS[groupId],
      targetStepId:
        state.demoProject.stepsSequence.find(
          (stepId) => DEMO_STEP_TO_GROUP[stepId].groupId === groupId,
        ) ?? DEMO_INITIAL_STATE.currentStep,
    }));

    return {
      currentProjectFlow: state.currentProjectFlow,
      currentStep: state.demoProject.currentStep,
      stepCategories,
    };
  },
);
