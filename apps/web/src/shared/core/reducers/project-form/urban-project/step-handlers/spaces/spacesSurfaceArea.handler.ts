import type { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_SURFACE_AREA";

export const SpacesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },
};
