import type { AnswerStepHandler } from "../../stepHandler.type";

export const InstallationExpensesHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",

    getNextStepId() {
      return "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES";
    },
  };
