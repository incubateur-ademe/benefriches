import type { CustomAnswerStepHandler } from "../../custom/stepHandlerRegistry";

export const siteActivityHandlers = {
  FRICHE_ACTIVITY: {
    stepId: "FRICHE_ACTIVITY",
    getNextStepId: () => "ADDRESS",
  } satisfies CustomAnswerStepHandler<"FRICHE_ACTIVITY">,

  AGRICULTURAL_OPERATION_ACTIVITY: {
    stepId: "AGRICULTURAL_OPERATION_ACTIVITY",
    getNextStepId: () => "ADDRESS",
  } satisfies CustomAnswerStepHandler<"AGRICULTURAL_OPERATION_ACTIVITY">,

  NATURAL_AREA_TYPE: {
    stepId: "NATURAL_AREA_TYPE",
    getNextStepId: () => "ADDRESS",
  } satisfies CustomAnswerStepHandler<"NATURAL_AREA_TYPE">,
};
