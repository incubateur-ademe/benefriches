import { DevelopmentPlanCategory } from "shared";

import { createProjectCreationAction } from "./actionsUtils";

export const introductionStepCompleted = createProjectCreationAction("introductionStepCompleted");
export const developmentPlanCategoriesCompleted =
  createProjectCreationAction<DevelopmentPlanCategory>("developmentPlanCategoriesCompleted");
