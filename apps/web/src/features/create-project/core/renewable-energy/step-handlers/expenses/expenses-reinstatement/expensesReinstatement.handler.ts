import type { ComputedReinstatementExpenses, ReinstatementExpense } from "shared";
import { computeProjectReinstatementExpenses } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswersByStep } from "../../../renewableEnergySteps";
import type {
  AnswerStepHandler,
  StepHandlerParams,
  StepInvalidationRule,
} from "../../stepHandler.type";

function getProjectSoilDistribution(params: StepHandlerParams) {
  const customAllocation = ReadStateHelper.getStepAnswers(
    params.answers,
    "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
  );
  if (customAllocation?.soilsDistribution) return customAllocation.soilsDistribution;

  const projectSelection = ReadStateHelper.getStepAnswers(
    params.answers,
    "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
  );
  if (projectSelection?.soilsDistribution) return projectSelection.soilsDistribution;

  return {};
}

const getDefaultReinstatementExpenses = (params: StepHandlerParams) => {
  const soilsDistribution = getProjectSoilDistribution(params);
  const decontaminatedSurface = ReadStateHelper.getStepAnswers(
    params.answers,
    "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
  )?.decontaminatedSurfaceArea;

  return computeProjectReinstatementExpenses(
    params.context.siteData?.soilsDistribution ?? {},
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

const findAmount = (expenses: ReinstatementExpense[] | undefined, purpose: string) =>
  expenses?.find((expense) => expense.purpose === purpose)?.amount;

// Recompute the reinstatement expenses when at least one amount is still the generated default:
// user-edited amounts are kept by getRecomputedStepAnswers.
export const getReinstatementExpensesRecomputationRules = (
  params: StepHandlerParams,
): StepInvalidationRule[] => {
  const reinstatementExpensesStep = ReadStateHelper.getStep(
    params.answers,
    "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
  );
  const hasGeneratedValues = reinstatementExpensesStep?.payload?.reinstatementExpenses?.some(
    (expense) =>
      expense.amount ===
      findAmount(reinstatementExpensesStep.defaultValues?.reinstatementExpenses, expense.purpose),
  );
  return hasGeneratedValues
    ? [{ stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT", action: "recompute" }]
    : [];
};

export const ReinstatementExpensesHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",

    getDefaultAnswers(params) {
      return formatDefaultValue(getDefaultReinstatementExpenses(params));
    },

    // Replaces the amounts still equal to their previous generated default with the new
    // default; amounts the user edited are kept.
    getRecomputedStepAnswers(params) {
      const oldStepState = ReadStateHelper.getStep(
        params.answers,
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
      );
      const newDefaultAnswers = formatDefaultValue(getDefaultReinstatementExpenses(params));

      if (!oldStepState) {
        return newDefaultAnswers;
      }

      return {
        reinstatementExpenses: (oldStepState.payload?.reinstatementExpenses ?? []).map(
          (oldExpense) => {
            const oldDefaultAmount = findAmount(
              oldStepState.defaultValues?.reinstatementExpenses,
              oldExpense.purpose,
            );
            if (oldExpense.amount !== oldDefaultAmount) {
              return oldExpense;
            }
            return {
              purpose: oldExpense.purpose,
              amount: findAmount(newDefaultAnswers.reinstatementExpenses, oldExpense.purpose) ?? 0,
            };
          },
        ),
      };
    },

    getPreviousStepId(params) {
      const willSiteBePurchased = ReadStateHelper.getStepAnswers(
        params.answers,
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
