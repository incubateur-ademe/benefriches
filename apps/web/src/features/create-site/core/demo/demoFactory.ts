import { createFormFactory } from "../../../../shared/core/reducers/form-factory/createFormUseCaseFactory";
import type { SiteCreationState } from "../createSite.reducer";
import { demoSiteSaved } from "./demoSiteSaved.action";
import {
  answersByStepSchemas,
  ANSWER_STEP_IDS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
} from "./demoSteps";
import { answerStepHandlers, demoStepHandlerRegistry } from "./stepHandlerRegistry";

export const demoFactory = createFormFactory({
  introductionSteps: INTRODUCTION_STEPS,
  summarySteps: SUMMARY_STEPS,
  answerStepIds: ANSWER_STEP_IDS,
  schemas: answersByStepSchemas,
  getSlice: (state: SiteCreationState) => state.demo,
  buildContext: (state: SiteCreationState) => ({
    siteData: state.siteData,
    stepsState: state.demo.steps,
  }),
  answerStepHandlers: answerStepHandlers,
  navigationHandlerRegistry: demoStepHandlerRegistry,
  actionPrefix: "siteCreation/demo",
  onPreviousStepFallback: (state) => {
    if (state.stepsHistory.length > 1) {
      state.stepsHistory = state.stepsHistory.slice(0, -1);
    }
  },
});

export const { ReadStateHelper } = demoFactory;

export const { previousStepRequested, nextStepRequested, stepCompletionRequested } =
  demoFactory.actions;

export const demoSiteCreationReducer = demoFactory.createFormUseCaseReducer((builder) => {
  builder.addCase(demoSiteSaved.pending, (state) => {
    state.demo.saveState = "loading";
  });
  builder.addCase(demoSiteSaved.fulfilled, (state) => {
    state.demo.saveState = "success";
  });
  builder.addCase(demoSiteSaved.rejected, (state) => {
    state.demo.saveState = "error";
  });
});
