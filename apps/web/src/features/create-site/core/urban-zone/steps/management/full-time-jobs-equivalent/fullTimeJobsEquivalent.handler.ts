import { ReadStateHelper } from "../../../helpers/stateHelpers";
import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const FullTimeJobsEquivalentHandler = {
  stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",

  getNextStepId() {
    return "URBAN_ZONE_NAMING_INTRODUCTION";
  },

  getPreviousStepId(context) {
    const footprintSurfaceArea = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
    )?.surfaceArea;

    if (footprintSurfaceArea === 0) {
      return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT";
    }
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT">;
