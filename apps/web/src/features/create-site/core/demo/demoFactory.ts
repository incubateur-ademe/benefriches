import type { SiteCreationState } from "../createSite.reducer";
import { createSiteFactory } from "../factory/createSiteUseCaseFactory";
import { demoSiteSaved } from "./demoSiteSaved.action";
import {
  answersByStepSchemas,
  ANSWER_STEP_IDS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
} from "./demoSteps";
import { answerStepHandlers, demoStepHandlerRegistry } from "./stepHandlerRegistry";

export const demoFactory = createSiteFactory({
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
});

export const { ReadStateHelper } = demoFactory;

export const { previousStepRequested, nextStepRequested, stepCompletionRequested } =
  demoFactory.actions;

export const demoSiteCreationReducer = demoFactory.createSiteUseCaseReducer((builder) => {
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
