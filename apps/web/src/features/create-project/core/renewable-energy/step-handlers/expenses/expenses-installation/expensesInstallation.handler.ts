import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const InstallationExpensesHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",

    getPreviousStepId(context) {
      if (context.siteData?.nature === "FRICHE") {
        return "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT";
      }
      const willSiteBePurchased = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
      )?.willSiteBePurchased;

      return willSiteBePurchased
        ? "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS"
        : "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION";
    },

    getNextStepId() {
      return "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES";
    },
  };
