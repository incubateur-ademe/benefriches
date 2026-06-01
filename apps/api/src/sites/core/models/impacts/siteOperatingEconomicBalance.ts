import {
  sumList,
  SiteYearlyExpense,
  SiteYearlyIncome,
  GetSiteImpactsDto,
  sumListWithKey,
  roundToInteger,
} from "shared";

import { computeCumulativeByYear } from "src/reconversion-projects/core/model/project-impacts/break-even-level/projectIndirectEconomicImpacts";
import { SumOnEvolutionPeriodService } from "src/reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

type Props = {
  yearlyIncomes: SiteYearlyIncome[];
  yearlyExpenses: SiteYearlyExpense[];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
export const getSiteStatuQuoOperatingEconomicBalance = ({
  yearlyIncomes,
  yearlyExpenses,
  sumOnEvolutionPeriodService,
}: Props): GetSiteImpactsDto["operatingEconomicBalance"] => {
  const details: GetSiteImpactsDto["operatingEconomicBalance"]["details"] = [
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
