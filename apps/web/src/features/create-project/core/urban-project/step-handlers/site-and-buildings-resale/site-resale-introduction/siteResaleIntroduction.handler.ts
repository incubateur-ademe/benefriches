import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { InfoStepHandler } from "../../stepHandler.type";

export const SiteResaleIntroductionHandler = {
  stepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",

  getPreviousStepId({ answers, context }) {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    if (involvesReinstatement !== false && context.siteData?.nature === "FRICHE") {
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
