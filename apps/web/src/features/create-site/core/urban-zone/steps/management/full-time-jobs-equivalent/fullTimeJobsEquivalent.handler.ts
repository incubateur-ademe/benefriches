import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";
import { getVacantPremisesFootprintSurfaceArea } from "../managementReaders";

export const FullTimeJobsEquivalentHandler = {
  stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",

  getNextStepId() {
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },

  getPreviousStepId(context) {
    const footprintSurfaceArea = getVacantPremisesFootprintSurfaceArea(context.stepsState);

    if (footprintSurfaceArea === 0) {
      return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT";
    }
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT">;
