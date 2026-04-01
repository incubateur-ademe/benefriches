import z from "zod";

import { UseCaseSelectionStep } from "./useCaseSelection.reducer";

const useCaseSelectionStepGroupIdSchema = z.enum(["CREATION_MODE", "PROJECT_TYPE"]);

export type UseCaseSelectionStepStepGroupId = z.infer<typeof useCaseSelectionStepGroupIdSchema>;

export const USE_CASE_SELECTION_STEP_GROUP_IDS = useCaseSelectionStepGroupIdSchema.options;

export const USE_CASE_SELECTION_STEP_GROUP_LABELS: Record<UseCaseSelectionStepStepGroupId, string> =
  {
    CREATION_MODE: "Connaissance du projet",
    PROJECT_TYPE: "Type de projet",
  };

type UseCaseSelectionStepStepStepperConfig = {
  groupId: UseCaseSelectionStepStepGroupId;
};

export const USE_CASE_SELECTION_STEP_TO_GROUP: Record<
  UseCaseSelectionStep,
  UseCaseSelectionStepStepStepperConfig
> = {
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
