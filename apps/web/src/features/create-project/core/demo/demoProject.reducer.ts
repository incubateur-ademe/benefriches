import { createFormFactory } from "@/shared/core/reducers/form-factory/createFormUseCaseFactory";

import { ProjectCreationState } from "../createProject.reducer";
import {
  demoProjectCreated,
  demoProjectSaved,
  demoStepGroupNavigated,
} from "./demoProject.actions.ts";
import {
  answersByStepSchemas,
  DemoAnswerStepId,
  DemoProjectStepsState,
  DemoSummaryStep,
} from "./demoSteps.ts";
import {
  answerStepHandlers,
  DemoStepContext,
  demoStepHandlerRegistry,
} from "./stepHandlerRegistry";

type DemoProjectStep =
  | "DEMO_PROJECT_TEMPLATE_SELECTION"
  | "DEMO_PROJECT_SUMMARY"
  | "DEMO_PROJECT_CREATION_RESULT";

export type DemoProjectCreationState = {
  currentStep: DemoProjectStep;
  stepsSequence: DemoProjectStep[];
  firstSequenceStep: DemoProjectStep;
  steps: DemoProjectStepsState;
  saveState: "idle" | "loading" | "success" | "error";
};

export const DEMO_INITIAL_STATE: DemoProjectCreationState = {
  currentStep: "DEMO_PROJECT_TEMPLATE_SELECTION",
  stepsSequence: [],
  firstSequenceStep: "DEMO_PROJECT_TEMPLATE_SELECTION",
  steps: {},
  saveState: "idle",
};

export const demoFactory = createFormFactory<
  typeof answersByStepSchemas,
  never,
  DemoSummaryStep,
  DemoAnswerStepId,
  DemoStepContext,
  ProjectCreationState
>({
  introductionSteps: [],
  summarySteps: ["DEMO_PROJECT_SUMMARY", "DEMO_PROJECT_CREATION_RESULT"],
  answerStepIds: ["DEMO_PROJECT_TEMPLATE_SELECTION"],
  schemas: answersByStepSchemas,
  getSlice: (state: ProjectCreationState) => state.demoProject,
  buildContext: (state: ProjectCreationState): DemoStepContext => ({
    siteData: state.siteData,
    stepsState: state.demoProject.steps,
  }),
  answerStepHandlers: answerStepHandlers,
  navigationHandlerRegistry: demoStepHandlerRegistry,
  actionPrefix: "projectCreation/demo",
  onPreviousStepFallback: (state) => {
    state.currentProjectFlow = "USE_CASE_SELECTION";
  },
});

export const { ReadStateHelper } = demoFactory;

export const { previousStepRequested, nextStepRequested, stepCompletionRequested } =
  demoFactory.actions;

export const demoProjectCreationReducer = demoFactory.createFormUseCaseReducer((builder) => {
  builder.addCase(demoProjectSaved.pending, (state) => {
    state.demoProject.saveState = "loading";
  });
  builder.addCase(demoProjectSaved.rejected, (state) => {
    state.demoProject.saveState = "error";
  });
  builder.addCase(demoProjectSaved.fulfilled, (state) => {
    state.demoProject.saveState = "success";
  });
  builder.addCase(demoProjectCreated.pending, (state) => {
    state.demoProject.steps.DEMO_PROJECT_SUMMARY = {
      completed: false,
      loadingState: "loading",
    };
  });
  builder.addCase(demoProjectCreated.rejected, (state) => {
    state.demoProject.steps.DEMO_PROJECT_SUMMARY = {
      completed: false,
      loadingState: "error",
    };
  });
  builder.addCase(demoProjectCreated.fulfilled, (state, action) => {
    state.demoProject.steps.DEMO_PROJECT_SUMMARY = {
      completed: false,
      loadingState: "success",
      data: action.payload,
    };
  });
  builder.addCase(demoStepGroupNavigated, (state, action) => {
    state.currentProjectFlow = "DEMO";
    state.demoProject.currentStep = action.payload;
  });
});
