import {
  LocalAuthorities,
  ProjectSiteView,
} from "@/features/create-project/core/project-form/projectSite.types";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/features/create-project/core/project-form/soilsCarbonStorage.types";
import { StepUpdateResult } from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";
import {
  AnswersByStep,
  AnswerStepId,
  UrbanProjectCreationStep,
  IntroductionStep,
  SummaryStep,
} from "./urbanProjectSteps";

type LoadingState = "idle" | "loading" | "success" | "error";

type SummaryStepState<T_Data> = {
  completed: boolean;
  loadingState?: "idle" | "loading" | "success" | "error";
  data?: T_Data;
};

type AnswerStepState<K extends AnswerStepId> = {
  completed: boolean;
  payload?: AnswersByStep[K];
  defaultValues?: AnswersByStep[K];
};

type InformationalStepState = {
  completed: boolean;
};

export interface WizardFormState<T extends UrbanProjectCreationStep = UrbanProjectCreationStep> {
  siteData?: ProjectSiteView;
  siteDataLoadingState: LoadingState;
  siteRelatedLocalAuthorities: {
    loadingState: LoadingState;
  } & LocalAuthorities;
  urbanProject: {
    currentStep: T;
    saveState: "idle" | "dirty" | "loading" | "success" | "error";
    siteResaleEstimationLoadingState: LoadingState;
    pendingStepCompletion?: {
      changes: StepUpdateResult<UrbanProjectCreationStep, AnswersByStep, AnswerStepId>;
      showAlert: boolean;
    };
    stepsSequence: UrbanProjectCreationStep[];
    firstSequenceStep: UrbanProjectCreationStep;
    steps: Partial<
      {
        URBAN_PROJECT_SOILS_CARBON_SUMMARY?: SummaryStepState<CurrentAndProjectedSoilsCarbonStorageResult>;
      } & {
        [K in AnswerStepId]: AnswerStepState<K>;
      } & {
        [K in IntroductionStep | SummaryStep]: InformationalStepState;
      }
    >;
  };
}

export const getWizardFormInitialState = <
  T extends UrbanProjectCreationStep = UrbanProjectCreationStep,
>(
  initialStep: T,
): WizardFormState<T> => {
  return {
    siteData: undefined,
    siteDataLoadingState: "idle",
    siteRelatedLocalAuthorities: {
      loadingState: "idle",
    },
    urbanProject: {
      currentStep: initialStep,
      saveState: "idle",
      siteResaleEstimationLoadingState: "idle",
      steps: {},
      firstSequenceStep: initialStep,
      stepsSequence: computeStepsSequence(
        { context: { siteData: undefined }, answers: {} },
        initialStep,
        stepHandlerRegistry,
      ),
      pendingStepCompletion: undefined,
    },
  };
};
