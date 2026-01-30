import { doesUseIncludeBuildings } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_SELECTION";

export const UsesSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA";
  },

  getDependencyRules(context, newAnswers) {
    const previousUses =
      ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID)?.usesSelection ?? [];
    const newUses = newAnswers.usesSelection ?? [];

    const noChanges =
      previousUses.length === newUses.length &&
      newUses.every((use) => previousUses.includes(use)) &&
      previousUses.every((use) => newUses.includes(use));

    if (noChanges) {
      return [];
    }

    const rules: StepInvalidationRule[] = [];

    // If footprint step exists, delete it when selection changes
    if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA")) {
      rules.push({
        stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
        action: "delete",
      });
    }

    // If floor area step exists, delete it when selection changes
    if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA")) {
      rules.push({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        action: "delete",
      });
    }

    return rules;
  },

  getShortcut(context, answers) {
    const selectedUses = answers.usesSelection ?? [];

    // If single use selected, auto-complete footprint with full site area
    if (selectedUses.length === 1 && selectedUses[0]) {
      const singleUse = selectedUses[0];
      const siteSurfaceArea = context.siteData?.surfaceArea;

      const footprintAnswers = {
        stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA" as const,
        answers: {
          usesFootprintSurfaceAreaDistribution: {
            [singleUse]: siteSurfaceArea,
          },
        },
      };

      // If use includes buildings, we need to go to floor area step
      if (doesUseIncludeBuildings(singleUse)) {
        return {
          complete: [footprintAnswers],
          next: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        };
      }

      // For non-building uses, skip floor area step entirely and go to spaces
      return {
        complete: [footprintAnswers],
        next: "URBAN_PROJECT_SPACES_INTRODUCTION",
      };
    }

    return undefined;
  },
};
