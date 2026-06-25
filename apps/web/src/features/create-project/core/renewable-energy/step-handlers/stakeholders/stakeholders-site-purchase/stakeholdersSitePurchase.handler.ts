import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SitePurchaseHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",

    getPreviousStepId(context) {
      const involvesReinstatement = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
      )?.involvesReinstatement;
      return involvesReinstatement === true
        ? "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR";
    },

    getNextStepId(_context, answers) {
      return answers?.willSiteBePurchased
        ? "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER"
        : "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION";
    },
  };
