import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";

import { EconomicBalance } from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { getEconomicBalanceImpactLabel } from "@/features/projects/views/project-impacts-page/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";
import { sumList } from "@/shared/services/sum/sum";

type Props = {
  economicBalance: EconomicBalance["economicBalance"];
  bearer?: string;
  onTitleClick: () => void;
};

function EconomicBalanceImpactCard({ economicBalance, onTitleClick, bearer = "Aménageur" }: Props) {
  const totalValues = economicBalance.map(({ value }) => value);

  const totalRevenues = sumList(totalValues.filter((value) => value > 0));
  const totalCosts = sumList(totalValues.filter((value) => value < 0));

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [
        `<strong>Dépenses</strong><br>${formatMonetaryImpact(totalCosts)}`,
        `<strong>Recettes</strong><br>${formatMonetaryImpact(totalRevenues)}`,
      ],
      opposite: true,
    },
    tooltip: {
      format: "<strong>{series.name}</strong><br>{point.customTooltip}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    legend: {
      enabled: false,
    },
    series: economicBalance.map(({ value, name }) => {
      const point = {
        y: roundTo2Digits(value),
        customTooltip: `${bearer} : ${formatMonetaryImpact(value)}`,
      };

      return {
        name: getEconomicBalanceImpactLabel(name),
        data: value > 0 ? [0, point] : [point, 0],
        type: "column",
      };
    }) as Array<Highcharts.SeriesOptionsType>,
  };

  return (
    <ImpactCard title="Bilan de l'opération" onTitleClick={onTitleClick}>
      {economicBalance.length === 0 ? (
        <div>Vous n'avez pas renseigné de coûts ni de dépenses pour ce projet.</div>
      ) : (
        <HighchartsReact
          containerProps={{ className: "highcharts-no-xaxis" }}
          highcharts={Highcharts}
          options={barChartOptions}
        />
      )}
    </ImpactCard>
  );
}

export default EconomicBalanceImpactCard;
