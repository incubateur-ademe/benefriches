import { IndirectEconomicImpact, RecurringExpense, SiteYearlyExpense, sumList } from "shared";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../projectIndirectEconomicImpacts";

const RENT_PURPOSE_KEY = "rent" as const;

type Props = {
  yearlyProjectedExpenses: RecurringExpense[];
  currentYearlyExpenses: SiteYearlyExpense[];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  hasSiteOwnerChange: boolean;
};
export const computeRentalIncomeImpacts = ({
  yearlyProjectedExpenses,
  currentYearlyExpenses,
  hasSiteOwnerChange,
  sumOnEvolutionPeriodService,
}: Props): IndirectEconomicImpact[] => {
  const impacts: IndirectEconomicImpact[] = [];

  const projectedRentCost = yearlyProjectedExpenses.find(
    ({ purpose }) => purpose === RENT_PURPOSE_KEY,
  );
  const currentRentCost = currentYearlyExpenses.find(({ purpose }) => purpose === RENT_PURPOSE_KEY);

  if (projectedRentCost && currentRentCost) {
    if (hasSiteOwnerChange) {
      const projectedDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        projectedRentCost.amount,
        ["discount"],
      );

      const currentDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        -currentRentCost.amount,
        ["discount"],
      );
      return [
        {
          detailsByYear: currentDetailsByYear,
          cumulativeByYear: computeCumulativeByYear(currentDetailsByYear),
          total: sumList(currentDetailsByYear),
          name: "oldRentalIncomeLoss",
        },
        {
          detailsByYear: projectedDetailsByYear,
          cumulativeByYear: computeCumulativeByYear(projectedDetailsByYear),
          total: sumList(projectedDetailsByYear),
          name: "projectedRentalIncome",
        },
      ];
    } else {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        projectedRentCost.amount - currentRentCost.amount,
        ["discount"],
      );
      return [
        {
          detailsByYear: detailsByYear,
          cumulativeByYear: computeCumulativeByYear(detailsByYear),

          total: sumList(detailsByYear),
          name: "projectedRentalIncomeIncrease",
        },
      ];
    }
  } else if (projectedRentCost) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      projectedRentCost.amount,
      ["discount"],
    );
    return [
      {
        detailsByYear: detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        total: sumList(detailsByYear),
        name: "projectedRentalIncome",
      },
    ];
  } else if (currentRentCost) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      -currentRentCost.amount,
      ["discount"],
    );

    return [
      {
        detailsByYear: detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        total: sumList(detailsByYear),
        name: "oldRentalIncomeLoss",
      },
    ];
  }

  return impacts;
};
