import type { SiteCreationState } from "../../createSite.reducer";
import type { UrbanZoneSiteCreationStep } from "../urbanZoneSteps";
import { MutateStateHelper } from "./mutateState";

export const navigateToAndLoadStep = (
  state: SiteCreationState,
  stepId: UrbanZoneSiteCreationStep,
) => {
  // Default answer loading via getDefaultAnswers() will be added in Phase 3
  // when the first AnswerStepHandler with getDefaultAnswers is registered.
  MutateStateHelper.navigateToStep(state, stepId);
};
