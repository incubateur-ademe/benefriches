import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { SocioEconomicImpactByActorAndCategory } from "@/features/projects/application/projectImpactsSocioEconomic.selectors";
import { getSocioEconomicImpactLabel } from "@/features/projects/views/project-impacts-page/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActorAndCategory["byActor"];
};

function SocioEconomicImpactsByActorChart({ socioEconomicImpacts }: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: socioEconomicImpacts.map(({ name, total }) => {
        const amountPrefix = total > 0 ? "+" : "";
        return `<strong>${getActorLabel(name)}</strong><br><span>${amountPrefix}${formatNumberFr(total)} €</span>`;
      }),
      opposite: true,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      format: "{point.impactsList}",
    },
    series: [
      {
        name: "Impact socio-économique",
        type: "column",
        data: socioEconomicImpacts.map(({ total, impacts, name }) => ({
          name: getActorLabel(name),
          y: roundTo2Digits(total),
          type: "column",
          impactsList: impacts
            .map(({ name, value }) => {
              const label = getSocioEconomicImpactLabel(name);
              const monetaryValue = formatMonetaryImpact(value);
              return `${label} : ${monetaryValue}`;
            })
            .join("<br>"),
        })),
      },
    ],
  };
  return (
    <HighchartsReact
      containerProps={{ className: "highcharts-no-xaxis" }}
      highcharts={Highcharts}
      options={barChartOptions}
    />
  );
}

export default SocioEconomicImpactsByActorChart;
