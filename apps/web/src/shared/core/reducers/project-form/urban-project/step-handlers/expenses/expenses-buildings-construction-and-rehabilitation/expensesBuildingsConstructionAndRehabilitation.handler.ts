import {
  hasBuildingsResalePlannedAfterDevelopment,
  willHaveBuildings,
} from "../../../helpers/readers/buildingsReaders";
import type { AnswerStepHandler } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";

export const ExpensesBuildingsConstructionAndRehabilitationHandler: AnswerStepHandler<
  typeof STEP_ID
> = {
  stepId: STEP_ID,
  getPreviousStepId() {
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },
  getNextStepId(context) {
    if (
      willHaveBuildings(context.stepsState) &&
      !hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },
};
