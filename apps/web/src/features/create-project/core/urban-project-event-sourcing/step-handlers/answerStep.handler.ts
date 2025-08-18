import { AnswerDeletionEvent } from "../form-events/AnswerDeletionEvent";
import { AnswerSetEvent } from "../form-events/AnswerSetEvent";
import { FormEvent } from "../form-events/FormEvent.type";
import { FormState } from "../form-state/formState";
import { AnswerStepId, AnswersByStep } from "../urbanProjectSteps";
import { BaseStepHandler, StepContext } from "./step.handler";

function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== "object" || typeof b !== "object") return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!(key in objB)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

export interface AnswerStepHandler<TAnswers> {
  load(context: StepContext): void;
  previous(context: StepContext): void;
  next(context: StepContext): void;
  complete(context: StepContext, answers: TAnswers): void;
  getAnswers(context: StepContext): TAnswers | undefined;
}

export abstract class BaseAnswerStepHandler<T extends AnswerStepId = AnswerStepId>
  extends BaseStepHandler
  implements AnswerStepHandler<AnswersByStep[T]>
{
  protected abstract override readonly stepId: T;

  abstract setDefaultAnswers(context: StepContext): void;
  abstract handleUpdateSideEffects(
    context: StepContext,
    previous: AnswersByStep[T],
    newAnswers: AnswersByStep[T],
  ): void;

  getAnswers(context: StepContext): AnswersByStep[T] | undefined {
    return FormState.getStepAnswers<T>(context.urbanProjectEventSourcing.events, this.stepId);
  }

  load(context: StepContext) {
    const answerEvent = this.getAnswers(context);

    // Ne pas recalculer si des réponses existent déjà
    if (answerEvent) return;

    this.setDefaultAnswers(context);
  }

  updateAnswers(
    context: StepContext,
    answers: AnswersByStep[T],
    source: "user" | "system" = "user",
  ): void {
    BaseAnswerStepHandler.addAnswerEvent<T>(context, this.stepId, answers, source);
  }

  isSameAnswers(base: AnswersByStep[T], other: AnswersByStep[T]) {
    return deepEqual(base, other);
  }

  complete(context: StepContext, answers: AnswersByStep[T]): void {
    const previousAnswers = this.getAnswers(context);

    const hasChanged = !previousAnswers || !this.isSameAnswers(previousAnswers, answers);

    if (hasChanged) {
      this.updateAnswers(context, answers);

      if (previousAnswers) {
        this.handleUpdateSideEffects(context, previousAnswers, answers);
      }
    }

    this.next(context);
  }

  static addAnswerEvent<K extends AnswerStepId>(
    context: StepContext,
    stepId: K,
    answers: AnswersByStep[K],
    source: "user" | "system" = "user",
  ) {
    context.urbanProjectEventSourcing.events.push(
      AnswerSetEvent.new(stepId, answers, source) as FormEvent,
    );
  }

  static addAnswerDeletionEvent(
    context: StepContext,
    stepId: AnswerStepId,
    source: "user" | "system" = "user",
  ) {
    if (FormState.getStepAnswers<typeof stepId>(context.urbanProjectEventSourcing.events, stepId)) {
      context.urbanProjectEventSourcing.events.push(
        AnswerDeletionEvent.new(stepId, source) as FormEvent,
      );
    }
  }
}
