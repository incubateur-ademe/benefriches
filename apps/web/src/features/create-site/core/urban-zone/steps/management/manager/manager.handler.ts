import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";

export const UrbanZoneManagerHandler = {
  stepId: "URBAN_ZONE_MANAGER",

  getNextStepId() {
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_MANAGER">;
