import { ComputedReinstatementExpenses, computeProjectReinstatementExpenses } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import { AnswersByStep } from "../../../renewableEnergySteps";
import type { AnswerStepHandler, StepContext } from "../../stepHandler.type";

function getProjectSoilDistribution(context: StepContext) {
  const customAllocation = ReadStateHelper.getStepAnswers(
    context.stepsState,
    "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
  );
  if (customAllocation?.soilsDistribution) return customAllocation.soilsDistribution;

  const projectSelection = ReadStateHelper.getStepAnswers(
    context.stepsState,
    "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
  );
  if (projectSelection?.soilsDistribution) return projectSelection.soilsDistribution;

  return {};
}

const getDefaultReinstatementExpenses = (context: StepContext) => {
  const soilsDistribution = getProjectSoilDistribution(context);
  const decontaminatedSurface = ReadStateHelper.getStepAnswers(
    context.stepsState,
    "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
  )?.decontaminatedSurfaceArea;

  return computeProjectReinstatementExpenses(
    context.siteData?.soilsDistribution ?? {},
    soilsDistribution,
    decontaminatedSurface ?? 0,
  );
};

const formatDefaultValue = (
  expenses: ComputedReinstatementExpenses,
): AnswersByStep["RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"] => {
  return {
    reinstatementExpenses: [
      { purpose: "asbestos_removal", amount: expenses.asbestosRemoval ?? 0 },
      { purpose: "deimpermeabilization", amount: expenses.deimpermeabilization ?? 0 },
      { purpose: "demolition", amount: expenses.demolition ?? 0 },
      {
        purpose: "sustainable_soils_reinstatement",
        amount: expenses.sustainableSoilsReinstatement ?? 0,
      },
      { purpose: "remediation", amount: expenses.remediation ?? 0 },
    ],
  };
};

export const ReinstatementExpensesHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",

    getDefaultAnswers(context) {
      return formatDefaultValue(getDefaultReinstatementExpenses(context));
    },

    getPreviousStepId(context) {
      const willSiteBePurchased = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
      )?.willSiteBePurchased;

      return willSiteBePurchased
        ? "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS"
        : "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION";
    },

    getNextStepId() {
      return "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION";
    },
  };
