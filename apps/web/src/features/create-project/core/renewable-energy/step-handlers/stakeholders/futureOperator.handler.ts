import type { AnswerStepHandler } from "../stepHandler.type";

export const FutureOperatorHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",

    getNextStepId(context) {
      return context.siteData?.nature === "FRICHE"
        ? "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE";
    },
  };
