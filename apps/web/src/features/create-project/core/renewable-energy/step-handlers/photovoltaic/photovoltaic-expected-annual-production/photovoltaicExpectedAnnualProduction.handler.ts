import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpectedAnnualProductionHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"> =
  {
    stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",

    getNextStepId() {
      return "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION";
    },
  };
