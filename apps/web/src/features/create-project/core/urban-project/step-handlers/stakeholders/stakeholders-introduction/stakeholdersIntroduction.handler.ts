import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";

import type { InfoStepHandler } from "../../stepHandler.type";

export const StakeholdersIntroductionHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getPreviousStepId(params) {
    if (willHaveBuildings(params.answers)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
