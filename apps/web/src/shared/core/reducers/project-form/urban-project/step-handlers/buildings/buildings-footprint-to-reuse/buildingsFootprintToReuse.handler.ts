import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";
import {
  getNextStepAfterBuildings,
  getProjectBuildingsFootprint,
  getSiteBuildingsFootprint,
} from "../buildingsReaders";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";

export const BuildingsFootprintToReuseHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION";
  },

  getNextStepId(context, answers) {
    const siteData = context.siteData;
    if (!siteData) return getNextStepAfterBuildings(context);

    // Use answers (not stepsState) because state hasn't been updated yet when this runs
    const siteBuildings = getSiteBuildingsFootprint(siteData);
    const projectBuildings = getProjectBuildingsFootprint(context.stepsState);
    const reuse = answers?.buildingsFootprintToReuse ?? 0;
    const demolished = siteBuildings - reuse;
    const newConstruction = Math.max(0, projectBuildings - reuse);
    const hasBoth = reuse > 0 && newConstruction > 0;

    if (demolished > 0) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    if (hasBoth) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (newConstruction > 0) {
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
    }
    return getNextStepAfterBuildings(context);
  },

  getDependencyRules(context, answers) {
    const siteData = context.siteData;
    if (!siteData) return [];

    const rules: StepInvalidationRule[] = [];
    const projectBuildingsFootprint = getProjectBuildingsFootprint(context.stepsState);
    const newReuse = answers.buildingsFootprintToReuse ?? 0;
    const newConstruction = Math.max(0, projectBuildingsFootprint - newReuse);
    const hasBoth = newReuse > 0 && newConstruction > 0;

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
        action: "invalidate",
      });
    }

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: hasBoth ? "invalidate" : "delete",
      });
    }

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: newConstruction > 0 ? "invalidate" : "delete",
      });
    }

    if (
      newConstruction === 0 &&
      ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        action: "delete",
      });
    }

    return rules;
  },
};
