import type { InfoStepHandler } from "../../stepHandler.type";

export const PublicGreenSpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION";
  },
};
