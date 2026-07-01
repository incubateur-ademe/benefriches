import { roundToInteger, sumList, sumListWithKey } from "../../services";
import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../../sum-on-evolution-period/computeCumulativeByYear";
import { SiteYearlyExpense } from "../yearlyExpenses";
import { SiteYearlyIncome } from "../yearlyIncome";
import { OperatingEconomicBalanceItem } from "./impacts.types";

type Props = {
  yearlyIncomes: SiteYearlyIncome[];
  yearlyExpenses: SiteYearlyExpense[];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
export const getSiteStatuQuoOperatingEconomicBalance = ({
  yearlyIncomes,
  yearlyExpenses,
  sumOnEvolutionPeriodService,
}: Props): { total: number; details: OperatingEconomicBalanceItem[] } => {
  const details: OperatingEconomicBalanceItem[] = [
    ...yearlyExpenses.map(({ amount, purpose }) => {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(-amount, [
        "discount",
      ]);
      return {
        details: purpose,
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        name: "operatingEconomicBalance" as const,
        total: sumList(detailsByYear),
      };
    }),
    ...yearlyIncomes.map(({ amount, source }) => {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(amount, [
        "discount",
      ]);
      return {
        details: source,
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        name: "operatingEconomicBalance" as const,
        total: sumList(detailsByYear),
      };
    }),
  ];
  return { total: roundToInteger(sumListWithKey(details, "total")), details };
};
