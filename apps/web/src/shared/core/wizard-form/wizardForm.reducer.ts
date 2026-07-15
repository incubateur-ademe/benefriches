import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/shared/core/wizard-form/soilsCarbonStorage.action";

import { StepUpdateResult } from "./helpers/computeStepChanges";
import { computeStepsSequence } from "./helpers/stepsSequence";
import { stepHandlerRegistry } from "./urban-project/step-handlers/stepHandlerRegistry";
import {
  AnswersByStep,
  AnswerStepId,
  UrbanProjectCreationStep,
  IntroductionStep,
  SummaryStep,
} from "./urban-project/urbanProjectSteps";
import { WizardFormReducerActions } from "./wizardForm.actions";
import { LocalAuthorities, ProjectSiteView } from "./wizardForm.types";

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

/**
 * Generic shape of a wizard-form instance's own sub-state, as lensed out of a consumer's
 * slice via `WizardFormDefinition.selectForm` (see ADR-0015). Urban nests this under its
 * own `urbanProject` key; other consumers may nest it under their own key — the engine
 * never hardcodes the key name, only this shape.
 */
export type WizardFormSubState<StepId, TAnswers, TPendingChanges = unknown> = {
  currentStep: StepId;
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
  pendingStepCompletion?: {
    changes: TPendingChanges;
    showAlert: boolean;
  };
  stepsSequence: StepId[];
  firstSequenceStep: StepId;
  steps: TAnswers;
};

/**
 * Definition a consumer supplies to wire its own wizard-form instance onto the generic
 * engine (see ADR-0015). `selectForm`/`buildContext` are the injected lens: they let the
 * engine locate a consumer's sub-state and eager context without hardcoding property names
 * like `state.urbanProject`/`state.siteData`.
 */
export type WizardFormDefinition<
  StepId,
  TContext,
  TAnswers,
  RootDraftState,
  TPendingChanges = unknown,
> = {
  prefix: string;
  registry: Record<string, unknown>;
  initialStep: StepId;
  config: {
    stepChangesNextMode: "step_order" | "next_empty";
    finalSummaryFallbackStep: StepId;
    onPreviousStepFallback?: (state: RootDraftState) => void;
  };
  selectForm: (state: RootDraftState) => WizardFormSubState<StepId, TAnswers, TPendingChanges>;
  buildContext: (state: RootDraftState) => TContext;
};

export const addWizardFormCasesToBuilder = <S extends WizardFormState>(
  builder: ActionReducerMapBuilder<S>,
  actions: WizardFormReducerActions,
) => {
  builder
    .addCase(actions.fetchSiteRelatedLocalAuthorities.pending, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "loading";
    })
    .addCase(actions.fetchSiteRelatedLocalAuthorities.fulfilled, (state, action) => {
      state.siteRelatedLocalAuthorities = {
        loadingState: "success",
        ...action.payload,
      };
    })
    .addCase(actions.fetchSiteRelatedLocalAuthorities.rejected, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "error";
    });
};
