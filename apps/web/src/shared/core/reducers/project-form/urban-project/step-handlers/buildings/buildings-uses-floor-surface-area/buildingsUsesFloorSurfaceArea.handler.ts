import { BENEFRICHES_ENV } from "@/app/envVars";

import type { AnswerStepHandler } from "../../stepHandler.type";
import { siteHasBuildings } from "../buildingsReaders";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";

export const BuildingsUsesFloorSurfaceAreaHandler = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
  },

  getNextStepId(context) {
    if (BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled) {
      if (context.siteData && siteHasBuildings(context.siteData)) {
        return "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION";
      }
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION";
    }

    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }

    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<typeof STEP_ID>;
