import { ReadStateHelper } from "../../helpers/readState";
import type { AnswerStepHandler } from "../stepHandler.type";

export const PowerHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"> = {
  stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",

  getNextStepId(context) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION";
  },
};
