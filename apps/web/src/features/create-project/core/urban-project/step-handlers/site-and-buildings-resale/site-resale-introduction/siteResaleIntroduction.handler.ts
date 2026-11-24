import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";
import { shouldAskReinstatementContractOwner } from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { InfoStepHandler } from "../../stepHandler.type";

export const SiteResaleIntroductionHandler = {
  stepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",

  getPreviousStepId({ answers, context }) {
    if (shouldAskReinstatementContractOwner(answers, context.siteData?.nature)) {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    if (willHaveBuildings(answers)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
