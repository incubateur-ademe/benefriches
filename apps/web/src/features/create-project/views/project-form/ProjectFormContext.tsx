import { createContext } from "react";

import { StepGroupId } from "@/features/create-project/core/urban-project/stepperConfig";
import { StepCompletionPayload } from "@/features/create-project/core/urban-project/urbanProjectForm.actions";
import { createUrbanProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProjectForm.selectors";
import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";

export type ProjectFormContextValue = ReturnType<typeof createUrbanProjectFormSelectors> & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: UrbanProjectCreationStep) => void;
  onNavigateToStepperGroup: (groupId: StepGroupId) => void;
  onFetchSoilsCarbonStorageDifference: () => void;
  onFetchSiteLocalAuthorities: () => void;
  onConfirmStepCompletion: () => void;
  onCancelStepCompletion: () => void;
  onSave: () => void;
};

export const ProjectFormContext = createContext<ProjectFormContextValue | null>(null);
