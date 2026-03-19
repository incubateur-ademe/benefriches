import type { AnswerStepHandler } from "../../../stepHandler.type";

export const VacantCommercialPremisesFootprintHandler = {
  stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",

  getNextStepId(_context, answer) {
    if (answer?.surfaceArea === 0) {
      return "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT";
    }
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT">;
