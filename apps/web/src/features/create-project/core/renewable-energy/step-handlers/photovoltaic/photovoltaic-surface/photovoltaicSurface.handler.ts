import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SurfaceHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE"> = {
  stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",

  getPreviousStepId(params) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER";
  },

  getNextStepId(params) {
    const keyParameter = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;

    return keyParameter === "POWER"
      ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
      : "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER";
  },
};
