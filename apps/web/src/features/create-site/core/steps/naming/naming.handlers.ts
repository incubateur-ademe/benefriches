import type {
  CustomAnswerStepHandler,
  CustomInfoStepHandler,
} from "../../custom/stepHandlerRegistry";

export const namingHandlers = {
  answerSteps: {
    NAMING: {
      stepId: "NAMING",
      getNextStepId: () => "FINAL_SUMMARY",
    } satisfies CustomAnswerStepHandler<"NAMING">,
  },
  infoSteps: {
    NAMING_INTRODUCTION: {
      stepId: "NAMING_INTRODUCTION",
      getNextStepId: () => "NAMING",
    } satisfies CustomInfoStepHandler,
  },
};
