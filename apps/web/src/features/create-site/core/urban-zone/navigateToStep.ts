import type { SiteCreationState } from "../createSite.reducer";
import { MutateStateHelper } from "./stateHelpers";
import type { UrbanZoneStepContext } from "./stepHandler.type";
import { urbanZoneStepHandlerRegistry } from "./stepHandlerRegistry";
import type { UrbanZoneSiteCreationStep } from "./urbanZoneSteps";

export const navigateToAndLoadStep = (
  state: SiteCreationState,
  stepId: UrbanZoneSiteCreationStep,
) => {
  MutateStateHelper.navigateToStep(state, stepId);

  const handler = urbanZoneStepHandlerRegistry[stepId];
  if (!handler || !("getDefaultAnswers" in handler) || !handler.getDefaultAnswers) return;

  const context: UrbanZoneStepContext = {
    siteData: state.siteData,
    stepsState: state.urbanZone.steps,
  };
  const defaultAnswers = handler.getDefaultAnswers(context);
  if (defaultAnswers !== undefined) {
    MutateStateHelper.setDefaultAnswers(state, handler.stepId, defaultAnswers);
  }
};
