import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";
import { willDemolishBuildings } from "../buildingsReaders";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";

export const BuildingsExistingBuildingsUsesFloorSurfaceAreaHandler: AnswerStepHandler<
  typeof STEP_ID
> = {
  stepId: STEP_ID,
  getPreviousStepId(context) {
    if (context.siteData && willDemolishBuildings(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  },
  // When a user updates a project or navigates back during creation, they may change the
  // existing buildings use allocation. Since new buildings uses = overall - existing,
  // the previously completed new buildings allocation becomes stale and must be re-entered.
  getDependencyRules(context) {
    const rules: StepInvalidationRule[] = [];

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: "invalidate",
      });
    }

    return rules;
  },
};
