import { createAction } from "@reduxjs/toolkit";
import type { DevelopmentPlanCategory, ProjectPhase } from "shared";

import type { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";

import { makeProjectCreationActionType } from "../actions/actionsUtils";
import type { UseCaseSelectionStep } from "./useCaseSelection.reducer";

const makeUseCaseSelectionProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`useCaseSelection/${actionName}`);
};

const createUseCaseSelectionAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeUseCaseSelectionProjectCreationActionType(actionName));

export const createModeCompleted = createUseCaseSelectionAction<"express" | "custom">(
  "createModeCompleted",
);

export const developmentPlanCategoriesCompleted =
  createUseCaseSelectionAction<DevelopmentPlanCategory>("developmentPlanCategoriesCompleted");

export const renewableEnergyTypeCompleted =
  createUseCaseSelectionAction<RenewableEnergyDevelopmentPlanType>("renewableEnergyTypeCompleted");

export const stepReverted = createUseCaseSelectionAction("stepReverted");

export const projectUseCaseSelectionStepGroupNavigated =
  createUseCaseSelectionAction<UseCaseSelectionStep>("useCaseSelectionStepGroupNavigated");

export const projectPhaseCompleted =
  createUseCaseSelectionAction<ProjectPhase>("projectPhaseCompleted");
