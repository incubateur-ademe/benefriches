import { FormState } from "../../form-state/formState";
import { InfoStepHandler } from "../stepHandler.type";

export const ExpensesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId(context) {
    if (FormState.hasBuildings(context.urbanProjectEventSourcing.events)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} as const;
