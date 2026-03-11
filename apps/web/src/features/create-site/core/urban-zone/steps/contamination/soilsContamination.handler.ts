import type { AnswerStepHandler } from "../../step-handlers/stepHandler.type";

export const UrbanZoneSoilsContaminationHandler = {
  stepId: "URBAN_ZONE_SOILS_CONTAMINATION",

  getNextStepId() {
    return "URBAN_ZONE_MANAGEMENT_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_SOILS_CONTAMINATION">;
