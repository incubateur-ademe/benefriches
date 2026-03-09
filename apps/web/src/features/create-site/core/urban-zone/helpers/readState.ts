import type {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneStepsState,
} from "../urbanZoneSteps";

export const ReadStateHelper = {
  getStep<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return steps[stepId] as
      | {
          completed: boolean;
          payload?: AnswersByStep[K];
          defaultValues?: AnswersByStep[K];
        }
      | undefined;
  },

  getStepAnswers<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return this.getStep(steps, stepId)?.payload;
  },

  getDefaultAnswers<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return this.getStep(steps, stepId)?.defaultValues;
  },
};
