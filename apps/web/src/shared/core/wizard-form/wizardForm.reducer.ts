/**
 * Generic shape of a wizard-form instance's own sub-state, as lensed out of a consumer's
 * slice via `WizardFormDefinition.selectForm` (see ADR-0015). Each consumer nests this under
 * its own key; the engine never hardcodes the key name, only this shape.
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
 * engine locate a consumer's sub-state and eager context without hardcoding property names.
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
