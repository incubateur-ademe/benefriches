import { AnswerStepId, AnswersByStep } from "../urbanProjectSteps";

type SerializedBaseEvent = {
  timestamp: number;
  source: "user" | "system";
};

export type FormEvent =
  | SerializedAnswerSetEvent<AnswerStepId>
  | SerializedAnswerDeletionEvent<AnswerStepId>;

export type SerializedAnswerSetEvent<T extends AnswerStepId> = SerializedBaseEvent & {
  type: "ANSWER_SET";
  stepId: T;
  payload: AnswersByStep[T];
};

export type SerializedAnswerDeletionEvent<T extends AnswerStepId> = SerializedBaseEvent & {
  type: "ANSWER_DELETED";
  stepId: T;
};
