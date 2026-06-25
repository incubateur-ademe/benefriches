import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const FutureOperatorHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",

    getNextStepId(context) {
      const involvesReinstatement = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
      )?.involvesReinstatement;
      return involvesReinstatement === true
        ? "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE";
    },
  };
