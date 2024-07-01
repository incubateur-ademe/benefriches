import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { SocioEconomicImpactByActorAndCategory } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-impacts-page/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";
import { sumList } from "@/shared/services/sum/sum";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActorAndCategory["byCategory"];
};

const getLabelForSocioEconomicImpactCategory = (
  socioEconomicImpactCategory: Props["socioEconomicImpacts"][number]["name"],
): string => {
  switch (socioEconomicImpactCategory) {
    case "economic_direct":
      return "Économiques directs";
    case "economic_indirect":
      return "Économiques indirects";
    case "social_monetary":
      return "Sociaux monétarisés";
    case "environmental_monetary":
      return "Environnementaux monétarisés";
  }
};

function SocioEconomicImpactsByCategoryChart({ socioEconomicImpacts }: Props) {
  const totalValues = socioEconomicImpacts.map(({ total }) => total);

  const totalPositiveImpactsAmount = sumList(totalValues.filter((value) => value > 0));
  const totalNegativeImpactsAmount = sumList(totalValues.filter((value) => value < 0));

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [
        `<strong>Négatif</strong><br>${formatMonetaryImpact(totalNegativeImpactsAmount)}`,
        `<strong>Positif</strong><br>${formatMonetaryImpact(totalPositiveImpactsAmount)}`,
      ],
      opposite: true,
    },
    tooltip: {
      format: "{series.name}<br>{point.impactsList}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    legend: {
      enabled: false,
    },
    series: socioEconomicImpacts.map(({ total, impacts, name }) => {
      const point = {
        y: roundTo2Digits(total),
        impactsList: impacts
          .map(({ name, value }) => {
            const label = getSocioEconomicImpactLabel(name);
            const monetaryValue = formatMonetaryImpact(value);
            return `${label} : ${monetaryValue}`;
          })
          .join("<br>"),
      };
      return {
        name: getLabelForSocioEconomicImpactCategory(name),
        data: total > 0 ? [0, point] : [point, 0],
        type: "column",
      };
    }) as Array<Highcharts.SeriesOptionsType>,
  };
  return (
    <HighchartsReact
      containerProps={{ className: "highcharts-no-xaxis" }}
      highcharts={Highcharts}
      options={barChartOptions}
    />
  );
}

export default SocioEconomicImpactsByCategoryChart;
