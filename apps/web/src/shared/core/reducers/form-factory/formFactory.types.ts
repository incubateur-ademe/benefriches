import type { z } from "zod";

import { AnswerStepHandlerMap, NavigationHandlerRegistry } from "./handlerRegistry.types";

export type StepData<T> = {
  completed: boolean;
  payload?: T;
  defaultValues?: T;
};

export type StepsState<Schemas extends Record<string, z.ZodTypeAny>> = Partial<{
  [K in keyof Schemas]: StepData<z.infer<Schemas[K]>>;
}>;

export type AnswersByStep<Schemas extends Record<string, z.ZodTypeAny>> = {
  [K in keyof Schemas]: z.infer<Schemas[K]>;
};

export type StepCompletionPayload<
  Schemas extends Record<string, z.ZodTypeAny>,
  K extends keyof Schemas = keyof Schemas,
> = { [P in K]: { stepId: P; answers: AnswersByStep<Schemas>[P] } }[K];

export type FormSlice<Schemas extends Record<string, z.ZodTypeAny>, CreationStep extends string> = {
  currentStep: CreationStep;
  steps: StepsState<Schemas>;
  stepsSequence: CreationStep[];
  firstSequenceStep: CreationStep;
};

export type FormFactoryConfig<
  Schemas extends Record<string, z.ZodTypeAny>,
  IntroStep extends string,
  SummaryStep extends string,
  AnswerStepId extends string,
  TStepContext,
  TState,
> = {
  introductionSteps: readonly IntroStep[];
  summarySteps: readonly SummaryStep[];
  answerStepIds: readonly AnswerStepId[];
  schemas: Schemas &
    Record<keyof Schemas extends AnswerStepId ? keyof Schemas : never, z.ZodTypeAny>;
  getSlice: (state: TState) => FormSlice<Schemas, IntroStep | SummaryStep | AnswerStepId>;
  buildContext: (state: TState) => TStepContext;
  answerStepHandlers: Partial<
    AnswerStepHandlerMap<Schemas, IntroStep | SummaryStep | AnswerStepId, TStepContext>
  >;
  navigationHandlerRegistry: NavigationHandlerRegistry<
    IntroStep | SummaryStep | AnswerStepId,
    TStepContext
  >;
  actionPrefix: string;
  /**
   * Appelé lors d'un "previousStep" quand aucune étape précédente n'existe dans
   * la séquence courante. Permet de gérer la navigation hors-séquence (ex: historique)
   * sans coupler la factory à un type de state spécifique.
   */
  onPreviousStepFallback?: (state: TState) => void;
};
