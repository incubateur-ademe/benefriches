import { ReadStateHelper } from "../../../helpers/readState";
import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpensesIntroductionHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",

  getPreviousStepId(params) {
    const willSiteBePurchased = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
    )?.willSiteBePurchased;

    return willSiteBePurchased
      ? "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER"
      : "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE";
  },

  getNextStepId(params) {
    const willSiteBePurchased = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
    )?.willSiteBePurchased;

    if (willSiteBePurchased) {
      return "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS";
    }
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;
    if (involvesReinstatement === true) {
      return "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT";
    }
    return "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION";
  },
};
