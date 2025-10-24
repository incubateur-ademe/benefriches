import { InfoStepHandler } from "../stepHandler.type";

export const ResidentialAndActivitySpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION";
  },
};
