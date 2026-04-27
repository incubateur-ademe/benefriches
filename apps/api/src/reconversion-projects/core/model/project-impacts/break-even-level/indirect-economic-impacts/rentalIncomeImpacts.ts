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
}: Props) => {
  const impacts: IndirectEconomicImpact[] = [];

  const projectedRentCost = yearlyProjectedExpenses.find(
    ({ purpose }) => purpose === RENT_PURPOSE_KEY,
  );
  const currentRentCost = currentYearlyExpenses.find(({ purpose }) => purpose === RENT_PURPOSE_KEY);
  if (projectedRentCost) {
    if (hasSiteOwnerChange) {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        projectedRentCost.amount,
        ["discount"],
      );
      impacts.push({
        detailsByYear: detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        total: sumList(detailsByYear),
        name: "projectedRentalIncome",
      });
    }
    if (currentRentCost) {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        projectedRentCost.amount - currentRentCost.amount,
        ["discount"],
      );
      impacts.push({
        detailsByYear: detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),

        total: sumList(detailsByYear),
        name: "projectedRentalIncomeIncrease",
      });
    }
  } else if (currentRentCost) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      -currentRentCost.amount,
      ["discount"],
    );

    impacts.push({
      detailsByYear: detailsByYear,

      cumulativeByYear: computeCumulativeByYear(detailsByYear),

      total: sumList(detailsByYear),
      name: "oldRentalIncomeLoss",
    });
  }
  return impacts;
};
