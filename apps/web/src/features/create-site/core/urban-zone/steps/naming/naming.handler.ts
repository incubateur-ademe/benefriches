import type { UrbanZoneAnswerStepHandler } from "../../stepHandlerRegistry";

export const UrbanZoneNamingHandler = {
  stepId: "URBAN_ZONE_NAMING",

  getNextStepId() {
    return "URBAN_ZONE_FINAL_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_NAMING_INTRODUCTION";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_NAMING">;
