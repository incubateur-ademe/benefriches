import { InfoStepHandler } from "../stepHandler.type";

export const SpacesCategoriesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION";
  },
};
