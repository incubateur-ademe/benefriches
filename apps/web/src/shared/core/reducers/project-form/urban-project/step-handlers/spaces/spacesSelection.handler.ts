import { isBuildingUse, isConstrainedSoilType, typedObjectKeys } from "shared";
import type { SoilType } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_SELECTION";

export const SpacesSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_SURFACE_AREA";
  },

  getDefaultAnswers(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    const hasBuildingUses = selectedUses.some((use) => isBuildingUse(use));

    // Get constrained soils that exist on the site
    const siteSoils = typedObjectKeys(context.siteData?.soilsDistribution ?? {});
    const existingConstrainedSoils = siteSoils.filter(isConstrainedSoilType);

    const defaultSpaces: SoilType[] = [
      ...(hasBuildingUses ? (["BUILDINGS"] as const) : []),
      ...existingConstrainedSoils,
    ];

    if (defaultSpaces.length > 0) {
      return { spacesSelection: defaultSpaces };
    }

    return undefined;
  },

  getDependencyRules(context, newAnswers) {
    const previousSpaces =
      ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID)?.spacesSelection ?? [];
    const newSpaces = newAnswers.spacesSelection ?? [];

    const noChanges =
      previousSpaces.length === newSpaces.length &&
      newSpaces.every((space) => previousSpaces.includes(space)) &&
      previousSpaces.every((space) => newSpaces.includes(space));

    if (noChanges) {
      return [];
    }

    const rules: StepInvalidationRule[] = [];

    // If surface area step exists, delete it when selection changes
    if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_SPACES_SURFACE_AREA")) {
      rules.push({
        stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        action: "delete",
      });
    }

    return rules;
  },
};
