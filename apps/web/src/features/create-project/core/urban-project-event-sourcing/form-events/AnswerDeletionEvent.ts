import { AnswerStepId } from "../urbanProjectSteps";
import { BaseFormEvent } from "./BaseAnswerEvent";

export class AnswerDeletionEvent extends BaseFormEvent<"ANSWER_DELETED", undefined> {
  protected override readonly type = "ANSWER_DELETED" as const;

  static new(stepId: AnswerStepId, source?: "user" | "system") {
    return new AnswerDeletionEvent({
      stepId,
      source,
    }).get();
  }
}
