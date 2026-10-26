import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";

import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpensesIntroductionHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId({ answers }) {
    if (willHaveBuildings(answers)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
