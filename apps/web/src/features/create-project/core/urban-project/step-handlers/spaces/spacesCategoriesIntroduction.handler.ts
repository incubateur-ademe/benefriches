import { InfoStepHandler } from "../stepHandler.type";

export const SpacesCategoriesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_CREATE_MODE_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION";
  },
};
