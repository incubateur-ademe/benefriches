import type { UrbanZoneAnswerStepHandler } from "../../stepHandlerRegistry";

export const UrbanZoneSoilsContaminationHandler = {
  stepId: "URBAN_ZONE_SOILS_CONTAMINATION",

  getNextStepId() {
    return "URBAN_ZONE_MANAGEMENT_INTRODUCTION";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_SOILS_CONTAMINATION">;
