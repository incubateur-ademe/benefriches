import type { SiteCreationState } from "../../createSite.reducer";
import type { UrbanZoneSiteCreationStep } from "../urbanZoneSteps";

export const MutateStateHelper = {
  navigateToStep(state: SiteCreationState, stepId: UrbanZoneSiteCreationStep) {
    state.urbanZone.currentStep = stepId;
  },
};
