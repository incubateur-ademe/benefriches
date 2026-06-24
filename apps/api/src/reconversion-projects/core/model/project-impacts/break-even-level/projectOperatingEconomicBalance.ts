import type {
  RecurringRevenue,
  RecurringExpense,
  ProjectOperatingEconomicBalanceItem,
} from "shared";
import { sumList } from "shared";

import type { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "./projectIndirectImpacts";

type Props = {
  yearlyProjectedRevenues: RecurringRevenue[];
  yearlyProjectedCosts: RecurringExpense[];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
export const getProjectOperatingEconomicBalance = ({
  yearlyProjectedRevenues,
  yearlyProjectedCosts,
  sumOnEvolutionPeriodService,
}: Props): ProjectOperatingEconomicBalanceItem[] => {
  return [
    ...yearlyProjectedCosts.map(({ amount, purpose }) => {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(-amount, [
        "discount",
      ]);
      return {
        details: purpose,
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        name: "projectOperatingEconomicBalance" as const,
        total: sumList(detailsByYear),
      };
    }),
    ...yearlyProjectedRevenues.map(({ amount, source }) => {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(amount, [
        "discount",
      ]);
      return {
        details: source,
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        name: "projectOperatingEconomicBalance" as const,
        total: sumList(detailsByYear),
      };
    }),
  ];
};
