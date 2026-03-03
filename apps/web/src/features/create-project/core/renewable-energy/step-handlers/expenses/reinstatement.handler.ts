import type { AnswerStepHandler } from "../stepHandler.type";

export const ReinstatementExpensesHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",

    getNextStepId() {
      return "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION";
    },
  };
