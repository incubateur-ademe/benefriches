import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationSurfaceAreaHandler: AnswerStepHandler<"RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA"> =
  {
    stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",

    getNextStepId() {
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION";
    },
  };
