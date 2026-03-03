import type { AnswerStepHandler } from "../../stepHandler.type";

export const ContractDurationHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION"> =
  {
    stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",

    getNextStepId(context) {
      return context.siteData?.contaminatedSoilSurface
        ? "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION"
        : "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION";
    },
  };
