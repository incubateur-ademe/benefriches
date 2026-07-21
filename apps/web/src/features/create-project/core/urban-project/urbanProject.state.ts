import { combineReducers, createReducer } from "@reduxjs/toolkit";

import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/features/create-project/core/project-form/soilsCarbonStorage.types";
import { StepUpdateResult } from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";
import {
  AnswersByStep,
  AnswerStepId,
  IntroductionStep,
  SummaryStep,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

type LoadingState = "idle" | "loading" | "success" | "error";

type SummaryStepState<T_Data> = {
  completed: boolean;
  loadingState?: LoadingState;
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

export type UrbanProjectStepsState = Partial<
  {
    URBAN_PROJECT_SOILS_CARBON_SUMMARY?: SummaryStepState<CurrentAndProjectedSoilsCarbonStorageResult>;
  } & {
    [K in AnswerStepId]: AnswerStepState<K>;
  } & {
    [K in IntroductionStep | SummaryStep]: InformationalStepState;
  }
>;

// Urban's wizard-form sub-state: a concrete instance of the engine's generic `WizardFormSubState`
// shape (see ADR-0015). Composed as the `form` key of `UrbanProjectState` via `combineReducers`.
// Only `currentStep` is parameterised over `T` (matching the pre-normalisation shape); the
// sequence arrays stay `UrbanProjectCreationStep`-typed because `computeStepsSequence` always
// yields the full creation-step union, and the update flow (a narrower step subset) reuses it.
export type UrbanProjectFormState<T extends UrbanProjectCreationStep = UrbanProjectCreationStep> = {
  currentStep: T;
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
  pendingStepCompletion?: {
    changes: StepUpdateResult<UrbanProjectCreationStep, AnswersByStep, AnswerStepId>;
    showAlert: boolean;
  };
  stepsSequence: UrbanProjectCreationStep[];
  firstSequenceStep: UrbanProjectCreationStep;
  steps: UrbanProjectStepsState;
};

// Self-contained urban slice: the wizard-form sub-state (`form`) plus urban's own lazily-fetched,
// step-scoped data (`siteResaleEstimationLoadingState`) as a sibling — never nested under `form`.
export type UrbanProjectState<T extends UrbanProjectCreationStep = UrbanProjectCreationStep> = {
  form: UrbanProjectFormState<T>;
  siteResaleEstimationLoadingState: LoadingState;
};

export const getUrbanProjectInitialState = <
  T extends UrbanProjectCreationStep = UrbanProjectCreationStep,
>(
  initialStep: T,
): UrbanProjectState<T> => {
  const formInitialState: UrbanProjectFormState<T> = {
    currentStep: initialStep,
    saveState: "idle",
    steps: {},
    firstSequenceStep: initialStep,
    stepsSequence: computeStepsSequence(
      { context: { siteData: undefined }, answers: {} },
      initialStep,
      stepHandlerRegistry,
    ),
    pendingStepCompletion: undefined,
  };

  // Runtime mutations for both `form` and `siteResaleEstimationLoadingState` are applied
  // through the shared builder in urbanProject.reducer.ts / updateProject.reducer.ts (they
  // need cross-slice `siteData` context via the injected lens, which a per-key combined
  // reducer cannot see). `combineReducers` here only assembles the initial value from each
  // key's own initial state, so the two are never actually dispatched to; the cast reflects
  // that `combineReducers`'s `CombinedState` return type is intentionally wider than the
  // exact shape callers consume.
  const composedReducer = combineReducers({
    form: createReducer(formInitialState, () => {}),
    siteResaleEstimationLoadingState: createReducer<LoadingState>("idle", () => {}),
  });

  return composedReducer(undefined, { type: "@@INIT" }) as UrbanProjectState<T>;
};
