import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const UrbanZoneManagerHandler = {
  stepId: "URBAN_ZONE_MANAGER",

  getNextStepId() {
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_MANAGER">;
