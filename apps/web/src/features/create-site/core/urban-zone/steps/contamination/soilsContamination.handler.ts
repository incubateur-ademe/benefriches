import type { AnswerStepHandler } from "../../step-handlers/stepHandler.type";

export const UrbanZoneSoilsContaminationHandler: AnswerStepHandler<"URBAN_ZONE_SOILS_CONTAMINATION"> =
  {
    stepId: "URBAN_ZONE_SOILS_CONTAMINATION",

    getNextStepId() {
      return "URBAN_ZONE_MANAGEMENT_INTRODUCTION";
    },
  };
