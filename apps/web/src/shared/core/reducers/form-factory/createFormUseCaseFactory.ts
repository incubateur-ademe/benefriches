import { ActionReducerMapBuilder, createAction, createReducer } from "@reduxjs/toolkit";
import type { z } from "zod";

import type {
  AnswersByStep,
  FormFactoryConfig,
  StepCompletionPayload,
  StepsState,
} from "./formFactory.types";
import { AnswerStepHandler } from "./handlerRegistry.types";

// Garde fou pour éviter de boucler à l'infini dans computeStepChanges,
// à faire évoluer en fonction du parcours avec le plus grand nombre d'étapes
const MAX_STEPS_NUMBER = 30;

export function createFormFactory<
  Schemas extends Record<string, z.ZodTypeAny>,
  IntroStep extends string,
  SummaryStep extends string,
  AnswerStepId extends string,
  TStepContext,
  TState,
>(cfg: FormFactoryConfig<Schemas, IntroStep, SummaryStep, AnswerStepId, TStepContext, TState>) {
  type SchematizedStepId = keyof Schemas;
  type CreationStep = IntroStep | SummaryStep | AnswerStepId;
  type State = StepsState<Schemas>;
  type Answers = AnswersByStep<Schemas>;
  type Payload<K extends SchematizedStepId = SchematizedStepId> = StepCompletionPayload<Schemas, K>;

  // ── Read ──────────────────────────────────────────────────────────────────

  const ReadStateHelper = {
    getStep<K extends SchematizedStepId>(steps: State, stepId: K) {
      return steps[stepId];
    },
    getStepAnswers<K extends SchematizedStepId>(steps: State, stepId: K) {
      return steps[stepId]?.payload;
    },
    getDefaultAnswers<K extends SchematizedStepId>(steps: State, stepId: K) {
      return steps[stepId]?.defaultValues;
    },
  };

  // ── Mutate ────────────────────────────────────────────────────────────────

  const MutateStateHelper = {
    navigateToStep(state: TState, stepId: CreationStep) {
      cfg.getSlice(state).currentStep = stepId;
    },
    completeStep<K extends SchematizedStepId>(state: TState, payload: Payload<K>) {
      (cfg.getSlice(state).steps as Record<string, unknown>)[payload.stepId as string] = {
        completed: true,
        payload: payload.answers,
      };
    },
    completeStepFromPayload(state: TState, payload: Payload) {
      (cfg.getSlice(state).steps as Record<string, unknown>)[payload.stepId as string] = {
        completed: true,
        payload: payload.answers,
      };
    },
    setDefaultAnswers<K extends SchematizedStepId>(
      state: TState,
      stepId: K,
      defaultValues: Answers[K],
    ) {
      const slice = cfg.getSlice(state);
      const existing = (slice.steps as Record<string, unknown>)[stepId as string];
      (slice.steps as Record<string, unknown>)[stepId as string] = {
        ...(typeof existing === "object" && existing !== null ? existing : {}),
        defaultValues,
      };
    },
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  function computeStepsSequence(context: TStepContext, initialStep: CreationStep): CreationStep[] {
    const sequence: CreationStep[] = [];

    let current: CreationStep = initialStep;
    let i = 0;

    while (i < MAX_STEPS_NUMBER) {
      sequence.push(current);

      const handler = cfg.navigationHandlerRegistry[current];
      if (!handler?.getNextStepId) break;

      const next = handler.getNextStepId(context);
      if (!next) break;

      current = next;
      i++;
    }

    return sequence;
  }

  function navigateToAndLoadStep(state: TState, stepId: CreationStep) {
    MutateStateHelper.navigateToStep(state, stepId);

    const handler = cfg.navigationHandlerRegistry[stepId];

    if (!handler?.getDefaultAnswers) return;

    const context = cfg.buildContext(state);
    const defaultAnswers = handler.getDefaultAnswers(context);
    if (defaultAnswers === undefined) return;

    MutateStateHelper.setDefaultAnswers(
      state,
      handler.stepId as SchematizedStepId,
      defaultAnswers as Answers[SchematizedStepId],
    );
  }

  // ── Step changes ──────────────────────────────────────────────────────────

  type StepUpdateResult<K extends SchematizedStepId> = {
    payload: Payload<K>;
    shortcutComplete?: Payload[];
    navigationTarget?: CreationStep;
  };

  function computeStepChanges<K extends SchematizedStepId>(
    state: TState,
    payload: Payload<K>,
  ): StepUpdateResult<K> {
    const handler = cfg.answerStepHandlers[payload.stepId] as
      | AnswerStepHandler<Schemas, CreationStep, TStepContext, K>
      | undefined;

    if (!handler) {
      throw new Error(`No handler registered for step ${String(payload.stepId)}`);
    }

    const context = cfg.buildContext(state);
    const newPayload: Payload<K> = {
      stepId: payload.stepId,
      answers: handler.updateAnswersMiddleware
        ? handler.updateAnswersMiddleware(context, payload.answers)
        : payload.answers,
    };

    if (handler.getShortcut) {
      const shortcut = handler.getShortcut(context, newPayload.answers);
      if (shortcut) {
        return {
          payload: newPayload,
          shortcutComplete: shortcut.complete,
          navigationTarget: shortcut.next,
        };
      }
    }

    return {
      payload: newPayload,
      navigationTarget: handler.getNextStepId?.(context, newPayload.answers),
    };
  }

  function applyStepChanges<K extends SchematizedStepId>(
    state: TState,
    changes: StepUpdateResult<K>,
  ): void {
    MutateStateHelper.completeStep(state, changes.payload);

    changes.shortcutComplete?.forEach((p) => {
      MutateStateHelper.completeStepFromPayload(state, p);
    });

    const slice = cfg.getSlice(state);
    slice.stepsSequence = computeStepsSequence(cfg.buildContext(state), slice.firstSequenceStep);

    if (changes.navigationTarget) {
      navigateToAndLoadStep(state, changes.navigationTarget);
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  const previousStepRequested = createAction(`${cfg.actionPrefix}/previousStepRequested`);
  const nextStepRequested = createAction(`${cfg.actionPrefix}/nextStepRequested`);
  const stepCompletionRequested = createAction(
    `${cfg.actionPrefix}/stepCompletionRequested`,
    (payload: Payload) => ({ payload }),
  );

  // ── Reducer ───────────────────────────────────────────────────────────────

  type CreateFormUseCaseReducerCallback = (builder: ActionReducerMapBuilder<TState>) => void;
  const createFormUseCaseReducer = (callback?: CreateFormUseCaseReducerCallback) =>
    createReducer({} as TState, (builder) => {
      builder.addCase(stepCompletionRequested, (state, action) => {
        const changes = computeStepChanges(state as TState, action.payload);
        applyStepChanges(state as TState, changes);
      });

      builder.addCase(nextStepRequested, (state) => {
        const slice = cfg.getSlice(state as TState);
        const handler = cfg.navigationHandlerRegistry[slice.currentStep];
        if (!handler?.getNextStepId) return;
        const nextStep = handler.getNextStepId(cfg.buildContext(state as TState));
        if (nextStep) navigateToAndLoadStep(state as TState, nextStep);
      });

      builder.addCase(previousStepRequested, (state) => {
        const slice = cfg.getSlice(state as TState);
        const handler = cfg.navigationHandlerRegistry[slice.currentStep];

        if (handler?.getPreviousStepId) {
          const previousStep = handler.getPreviousStepId(cfg.buildContext(state as TState));
          if (previousStep) navigateToAndLoadStep(state as TState, previousStep);
          return;
        }

        const currentIndex = slice.stepsSequence.indexOf(slice.currentStep);
        const previousStep = currentIndex > 0 ? slice.stepsSequence[currentIndex - 1] : undefined;

        if (previousStep) {
          navigateToAndLoadStep(state as TState, previousStep);
        } else {
          cfg.onPreviousStepFallback?.(state as TState);
        }
      });

      callback?.(builder);
    });

  // ─────────────────────────────────────────────────────────────────────────

  return {
    ReadStateHelper,
    MutateStateHelper,
    computeStepsSequence,
    navigateToAndLoadStep,
    computeStepChanges,
    applyStepChanges,
    actions: {
      previousStepRequested,
      nextStepRequested,
      stepCompletionRequested,
    },
    createFormUseCaseReducer,
  };
}
