import type { AnswerStepHandler } from "../stepHandler.type";

export const KeyParameterHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER"> =
  {
    stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",

    getNextStepId(_context, answers) {
      return answers?.photovoltaicKeyParameter === "POWER"
        ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"
        : "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE";
    },
  };
