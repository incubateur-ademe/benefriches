import type { AnswerStepHandler } from "../../step-handlers/stepHandler.type";

export const UrbanZoneNamingHandler = {
  stepId: "URBAN_ZONE_NAMING",

  getNextStepId() {
    return "URBAN_ZONE_FINAL_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_NAMING_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_NAMING">;
