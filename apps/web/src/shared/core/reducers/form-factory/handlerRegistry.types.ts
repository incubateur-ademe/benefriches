import type { z } from "zod";

import type { AnswersByStep, StepsState, StepCompletionPayload } from "./formFactory.types";

export type StepContext<Schemas extends Record<string, z.ZodTypeAny>, SiteData> = {
  siteData: SiteData;
  stepsState: StepsState<Schemas>;
};

type BaseStepHandler<CreationStep extends string, TStepContext> = {
  readonly stepId: CreationStep;
  getNextStepId?(context: TStepContext): CreationStep;
  getPreviousStepId?(context: TStepContext): CreationStep;
};

export type InfoStepHandler<
  IntroStep extends string,
  SummaryStep extends string,
  AnswerStep extends string,
  TStepContext,
> = BaseStepHandler<IntroStep | SummaryStep | AnswerStep, TStepContext> & {
  readonly stepId: IntroStep | SummaryStep;
};

export type ShortcutResult<
  Schemas extends Record<string, z.ZodTypeAny>,
  CreationStep extends string,
> = {
  complete: StepCompletionPayload<Schemas>[];
  next: CreationStep;
};

export type AnswerStepHandler<
  Schemas extends Record<string, z.ZodTypeAny>,
  CreationStep extends string,
  TStepContext,
  K extends keyof Schemas,
> = Omit<BaseStepHandler<CreationStep, TStepContext>, "getNextStepId"> & {
  readonly stepId: K;
  getNextStepId(context: TStepContext, answers?: AnswersByStep<Schemas>[K]): CreationStep;
  getPreviousStepId?(context: TStepContext): CreationStep;
  getDefaultAnswers?(context: TStepContext): AnswersByStep<Schemas>[K] | undefined;
  getShortcut?(
    context: TStepContext,
    answers: AnswersByStep<Schemas>[K],
  ): ShortcutResult<Schemas, CreationStep> | undefined;
  updateAnswersMiddleware?(
    context: TStepContext,
    answers: AnswersByStep<Schemas>[K],
  ): AnswersByStep<Schemas>[K];
};

export type AnswerStepHandlerMap<
  Schemas extends Record<string, z.ZodTypeAny>,
  CreationStep extends string,
  TStepContext,
> = {
  [K in keyof Schemas]: AnswerStepHandler<Schemas, CreationStep, TStepContext, K>;
};

type NavigationHandler<CreationStep extends string, TStepContext> = {
  stepId: CreationStep;
  getNextStepId?: (context: TStepContext) => CreationStep;
  getPreviousStepId?: (context: TStepContext) => CreationStep;
  getDefaultAnswers?: (context: TStepContext) => unknown;
};

export type NavigationHandlerRegistry<CreationStep extends string, TStepContext> = Partial<
  Record<CreationStep, NavigationHandler<CreationStep, TStepContext>>
>;
