import type { AnswerStepHandler } from "../../stepHandler.type";

export const ContractDurationHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION"> =
  {
    stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",

    getNextStepId(context) {
      if (context.siteData?.nature === "FRICHE") {
        return "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT";
      }
      return context.siteData?.contaminatedSoilSurface
        ? "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION"
        : "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION";
    },
  };
