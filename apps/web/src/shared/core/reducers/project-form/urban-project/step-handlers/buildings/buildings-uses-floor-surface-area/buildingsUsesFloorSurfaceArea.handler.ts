import type { AnswerStepHandler } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";

export const BuildingsUsesFloorSurfaceAreaHandler = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
  },

  getNextStepId(context) {
    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }

    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<typeof STEP_ID>;
