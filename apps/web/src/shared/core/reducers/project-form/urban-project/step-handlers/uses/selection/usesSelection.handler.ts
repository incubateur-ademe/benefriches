import { doesUseIncludeBuildings } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { getDeleteBuildingsRules } from "../../spaces/getCommonRules";
import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_SELECTION";

export const UsesSelectionHandler = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_INTRODUCTION";
  },

  getNextStepId(_context, answers) {
    const selectedUses = answers?.usesSelection ?? [];

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA";
    }

    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },

  getShortcut(context, answers) {
    const selectedUses = answers.usesSelection ?? [];
    const isOnlyPublicGreenSpaces =
      selectedUses.length === 1 && selectedUses[0] === "PUBLIC_GREEN_SPACES";

    if (!isOnlyPublicGreenSpaces) {
      return undefined;
    }

    const siteSurfaceArea = context.siteData?.surfaceArea ?? 0;

    return {
      complete: [
        {
          stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
          answers: { publicGreenSpacesSurfaceArea: siteSurfaceArea },
        },
      ],
      next: "URBAN_PROJECT_SPACES_INTRODUCTION",
    };
  },

  getDependencyRules(context, newAnswers) {
    const previousUses =
      ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID)?.usesSelection ?? [];
    const newUses = newAnswers.usesSelection ?? [];
    const hadBuildings = previousUses.some(doesUseIncludeBuildings);
    const willHaveBuildings = newUses.some(doesUseIncludeBuildings);

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
      ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA")
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
        action: "delete",
      });
    }

    // If public green spaces soils distribution step exists, delete it when selection changes
    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        action: "delete",
      });
    }

    // If floor area step exists, delete it when selection changes
    if (
      ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA")
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: "delete",
      });
    }

    if (hadBuildings && !willHaveBuildings) {
      getDeleteBuildingsRules(context).forEach((rule) => {
        if (!rules.some((existingRule) => existingRule.stepId === rule.stepId)) {
          rules.push(rule);
        }
      });
    }

    return rules;
  },
} satisfies AnswerStepHandler<typeof STEP_ID>;
