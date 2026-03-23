import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { InfoStepHandler } from "../../stepHandler.type";

export const StakeholdersIntroductionHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getPreviousStepId(context) {
    if (ReadStateHelper.willHaveBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
