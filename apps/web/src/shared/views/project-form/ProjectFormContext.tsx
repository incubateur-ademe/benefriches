import { createContext } from "react";

import { StepCompletionPayload } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { StepGroupId } from "./stepper/stepperConfig";

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
