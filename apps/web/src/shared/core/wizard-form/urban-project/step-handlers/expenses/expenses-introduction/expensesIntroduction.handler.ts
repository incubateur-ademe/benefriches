import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";

import { willConstructNewBuildings } from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpensesIntroductionHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId({ answers, context }) {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    if (involvesReinstatement !== false && context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    if (willConstructNewBuildings(answers)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
} satisfies InfoStepHandler;
