import { AnswerStepId, AnswersByStep } from "../urbanProjectSteps";
import { BaseFormEvent } from "./BaseAnswerEvent";

type StepPayload<T extends AnswerStepId> = AnswersByStep[T];

export class AnswerSetEvent<T extends AnswerStepId> extends BaseFormEvent<
  "ANSWER_SET",
  StepPayload<T>
> {
  protected override readonly type = "ANSWER_SET" as const;

  static new<K extends AnswerStepId>(
    stepId: K,
    payload: AnswersByStep[K],
    source?: "user" | "system",
  ) {
    return new AnswerSetEvent<K>({
      stepId,
      payload,
      source,
    }).get();
  }
}
