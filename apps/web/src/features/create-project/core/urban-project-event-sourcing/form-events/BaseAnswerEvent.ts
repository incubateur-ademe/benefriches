import { AnswerStepId } from "../urbanProjectSteps";

type Props<T_Payload> = {
  stepId: AnswerStepId;
  source?: "user" | "system";
  payload?: T_Payload;
};

export abstract class BaseFormEvent<T_Type extends "ANSWER_SET" | "ANSWER_DELETED", T_Payload> {
  protected abstract readonly type: T_Type;
  protected readonly stepId: AnswerStepId;

  protected readonly timestamp: number;
  protected readonly source: "user" | "system";
  protected readonly payload?: T_Payload;

  constructor({ stepId, source, payload }: Props<T_Payload>) {
    this.source = source ?? "user";
    this.stepId = stepId;
    this.payload = payload;
    this.timestamp = Date.now();
  }

  get() {
    return {
      stepId: this.stepId,
      type: this.type,
      timestamp: this.timestamp,
      source: this.source,
      ...(this.payload && { payload: this.payload }),
    } as const;
  }
}
