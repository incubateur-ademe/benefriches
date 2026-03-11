import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const UrbanZoneManagerHandler: AnswerStepHandler<"URBAN_ZONE_MANAGER"> = {
  stepId: "URBAN_ZONE_MANAGER",

  getNextStepId() {
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT";
  },
};
