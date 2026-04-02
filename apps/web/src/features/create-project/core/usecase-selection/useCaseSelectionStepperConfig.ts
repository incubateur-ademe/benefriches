import z from "zod";

import { UseCaseSelectionStep } from "./useCaseSelection.reducer";

const useCaseSelectionStepGroupIdSchema = z.enum([
  "PROJECT_PHASE",
  "CREATION_MODE",
  "PROJECT_TYPE",
]);

export type UseCaseSelectionStepGroupId = z.infer<typeof useCaseSelectionStepGroupIdSchema>;

export const USE_CASE_SELECTION_STEP_GROUP_IDS = useCaseSelectionStepGroupIdSchema.options;

export const USE_CASE_SELECTION_STEP_GROUP_LABELS: Record<UseCaseSelectionStepGroupId, string> = {
  PROJECT_PHASE: "Avancement du projet",
  CREATION_MODE: "Connaissance du projet",
  PROJECT_TYPE: "Type de projet",
};

type UseCaseSelectionStepStepStepperConfig = {
  groupId: UseCaseSelectionStepGroupId;
};

export const USE_CASE_SELECTION_STEP_TO_GROUP: Record<
  UseCaseSelectionStep,
  UseCaseSelectionStepStepStepperConfig
> = {
  USE_CASE_SELECTION_PROJECT_PHASE: {
    groupId: "PROJECT_PHASE",
  },
  USE_CASE_SELECTION_CREATION_MODE: {
    groupId: "CREATION_MODE",
  },
  USE_CASE_SELECTION_PROJECT_TYPE_SELECTION: {
    groupId: "PROJECT_TYPE",
  },
  USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE: {
    groupId: "PROJECT_TYPE",
  },
};
