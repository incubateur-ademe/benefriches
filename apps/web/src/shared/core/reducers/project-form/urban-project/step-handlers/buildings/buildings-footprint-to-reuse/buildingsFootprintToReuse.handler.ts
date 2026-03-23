import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";
import {
  getBuildingsFootprintToReuse,
  getNextStepAfterBuildings,
  getProjectBuildingsFootprint,
  willConstructNewBuildings,
  willDemolishBuildings,
} from "../buildingsReaders";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";

export const BuildingsFootprintToReuseHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION";
  },

  getNextStepId(context) {
    const siteData = context.siteData;
    if (!siteData) return getNextStepAfterBuildings(context);

    if (willDemolishBuildings(siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }

    const reuse = getBuildingsFootprintToReuse(context.stepsState) ?? 0;
    const projectBuildings = getProjectBuildingsFootprint(context.stepsState);
    const newConstruction = Math.max(0, projectBuildings - reuse);
    const hasBoth = reuse > 0 && newConstruction > 0;

    if (hasBoth) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (willConstructNewBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
    }
    return getNextStepAfterBuildings(context);
  },

  getDependencyRules(context, answers) {
    const siteData = context.siteData;
    if (!siteData) return [];

    const rules: StepInvalidationRule[] = [];
    const newReuse = answers.buildingsFootprintToReuse ?? 0;
    const projectBuildingsFootprint = getProjectBuildingsFootprint(context.stepsState);
    const newConstruction = Math.max(0, projectBuildingsFootprint - newReuse);
    const hasBoth = newReuse > 0 && newConstruction > 0;

    rules.push({
      stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
      action: "invalidate",
    });

    rules.push({
      stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      action: hasBoth ? "invalidate" : "delete",
    });

    rules.push({
      stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      action: hasBoth ? "invalidate" : "delete",
    });

    if (newConstruction === 0) {
      rules.push({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        action: "delete",
      });
    }

    return rules;
  },
};
