import { doesUseIncludeBuildings } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_SELECTION";

export const UsesSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_INTRODUCTION";
  },

  getNextStepId(_context, answers) {
    const selectedUses = answers?.usesSelection ?? [];

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      return "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA";
    }

    const hasBuildingUses = selectedUses.some((use) => doesUseIncludeBuildings(use));

    if (hasBuildingUses) {
      return "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";
    }

    return "URBAN_PROJECT_SPACES_INTRODUCTION";
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

    // If public green spaces surface area step exists, delete it when selection changes
    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA",
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
};
