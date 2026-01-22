import { isBuildingUse } from "shared";

import { isObjectsEqual } from "@/shared/core/isObjectsEqual/isObjectsEqual";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA";

export const UsesFootprintSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    const hasBuildingUses = selectedUses.some((use) => isBuildingUse(use));

    if (hasBuildingUses) {
      return "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";
    }

    // Skip floor area step when no building uses
    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },

  getDependencyRules(context, newAnswers) {
    const previousDistribution =
      ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID)
        ?.usesFootprintSurfaceAreaDistribution ?? {};
    const newDistribution = newAnswers.usesFootprintSurfaceAreaDistribution ?? {};

    if (isObjectsEqual(previousDistribution, newDistribution)) {
      return [];
    }

    const rules: StepInvalidationRule[] = [];

    // Invalidate floor area step if footprint changes for building uses
    if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA")) {
      rules.push({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        action: "invalidate",
      });
    }

    return rules;
  },
};
