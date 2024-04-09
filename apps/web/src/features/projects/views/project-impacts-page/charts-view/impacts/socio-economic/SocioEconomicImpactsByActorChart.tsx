import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sumSocioEconomicImpactsByActor } from "./socioEconomicImpacts";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
};

function SocioEconomicImpactsByActorChart({ socioEconomicImpacts }: Props) {
  const impactsSummedByActor = sumSocioEconomicImpactsByActor(socioEconomicImpacts);

  const maxAbsValue = Math.max(
    ...Array.from(impactsSummedByActor).map(([, amount]) => Math.abs(amount)),
  );

  const data = Array.from(impactsSummedByActor).map(([actor, amount]) => ({
    name: getActorLabel(actor),
    y: roundTo2Digits(amount),
    type: "column",
  }));

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: Array.from(impactsSummedByActor).map(([actor, amount]) => {
        const amountPrefix = amount > 0 ? "+" : "";
        return `<strong>${getActorLabel(actor)}</strong><br><span>${amountPrefix}${formatNumberFr(amount)} €</span>`;
      }),
      lineWidth: 0,
    },
    yAxis: {
      min: -maxAbsValue,
      max: maxAbsValue,
      startOnTick: false,
      endOnTick: false,
      title: { text: null },
      plotLines: [
        {
          value: 0,
          width: 2,
          color: "#929292",
        },
      ],
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      valueSuffix: ` €`,
    },
    series: [
      {
        name: "Impact socio-économique",
        type: "column",
        data,
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={barChartOptions} />;
}

export default SocioEconomicImpactsByActorChart;
