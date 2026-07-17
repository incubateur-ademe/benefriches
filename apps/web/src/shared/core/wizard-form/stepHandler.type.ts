// Generic wizard-form step-handler contract (ADR-0015), parameterized over
// <StepId, TContext, TAnswers>. Each consumer aliases these with its own concrete
// step/context/answers types. TAnswers is a map from step id to answer payload;
// `WizardFormStepsState` wraps it into the accumulated, per-step state handlers actually read.

export type WizardStepState<TPayload> = {
  completed: boolean;
  payload?: TPayload;
  defaultValues?: TPayload;
};

export type WizardFormStepsState<TAnswers> = Partial<{
  [K in keyof TAnswers]: WizardStepState<TAnswers[K]>;
}>;

export type StepHandlerParams<TContext, TAnswers> = {
  context: TContext;
  answers: WizardFormStepsState<TAnswers>;
};

export type StepInvalidationRule<StepId> = {
  action: "delete" | "invalidate" | "recompute";
  stepId: StepId;
};

export type StepAnswerPayload<TAnswers, K extends keyof TAnswers = keyof TAnswers> = {
  [P in K]: { stepId: P; answers: TAnswers[P] };
}[K];

export type ShortcutResult<StepId, TAnswers> = {
  complete: StepAnswerPayload<TAnswers>[];
  next: StepId;
};

// InfoStepId = this handler's own id (a subset); StepId = the full nav-target union.
export interface InfoStepHandler<StepId, InfoStepId extends StepId, TContext, TAnswers> {
  readonly stepId: InfoStepId;
  getNextStepId?(params: StepHandlerParams<TContext, TAnswers>): StepId;
  getPreviousStepId?(params: StepHandlerParams<TContext, TAnswers>): StepId;
}

export interface AnswerStepHandler<StepId, TContext, TAnswers, K extends keyof TAnswers> {
  readonly stepId: K;
  getNextStepId(params: StepHandlerParams<TContext, TAnswers>, answers?: TAnswers[K]): StepId;
  getPreviousStepId?(params: StepHandlerParams<TContext, TAnswers>): StepId;
  getDefaultAnswers?(params: StepHandlerParams<TContext, TAnswers>): TAnswers[K] | undefined;
  getRecomputedStepAnswers?(params: StepHandlerParams<TContext, TAnswers>): TAnswers[K] | undefined;
  getDependencyRules?(
    params: StepHandlerParams<TContext, TAnswers>,
    answers: TAnswers[K],
  ): StepInvalidationRule<keyof TAnswers>[];
  getShortcut?(
    params: StepHandlerParams<TContext, TAnswers>,
    answers: TAnswers[K],
  ): ShortcutResult<StepId, TAnswers> | undefined;
  updateAnswersMiddleware?(
    params: StepHandlerParams<TContext, TAnswers>,
    answers: TAnswers[K],
  ): TAnswers[K];
}

// A registry keyed by every answer step id, each yielding its correlated handler.
export type AnswerStepHandlerRegistry<StepId, TContext, TAnswers> = {
  [K in keyof TAnswers]: AnswerStepHandler<StepId, TContext, TAnswers, K>;
};

// Combined registry for navigation (step sequence walk, back navigation): every step id,
// answer or info, yields its handler.
export type StepHandlerRegistry<
  StepId extends PropertyKey,
  InfoStepId extends StepId,
  TContext,
  TAnswers,
> = AnswerStepHandlerRegistry<StepId, TContext, TAnswers> &
  Record<InfoStepId, InfoStepHandler<StepId, InfoStepId, TContext, TAnswers>>;
