import { doesUseIncludeBuildings } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { InfoStepHandler } from "../stepHandler.type";

export const SpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_INTRODUCTION",

  getPreviousStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    if (selectedUses.some(doesUseIncludeBuildings)) {
      return "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";
    }

    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_SELECTION";
  },
};
