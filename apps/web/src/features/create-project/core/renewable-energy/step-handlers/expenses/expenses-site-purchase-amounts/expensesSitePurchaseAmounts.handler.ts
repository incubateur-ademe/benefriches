import type { AnswerStepHandler } from "../../stepHandler.type";

export const SitePurchaseAmountsHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",

    getNextStepId(context) {
      if (context.siteData?.nature === "FRICHE") {
        return "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT";
      }
      return "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION";
    },
  };
