import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactCard from "../../ImpactChartCard";

import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  reconversionProjectName: string;
  fullTimeJobsImpact: {
    current: number;
    forecast: number;
    conversion: {
      current: number;
      forecast: number;
    };
    operations: {
      current: number;
      forecast: number;
    };
  };
};

function FullTimeJobsImpactCard({ reconversionProjectName, fullTimeJobsImpact }: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: ["Pas de changement", reconversionProjectName],
    },
    tooltip: {
      valueSuffix: ` ETP`,
    },
    plotOptions: {
      area: {
        stacking: "normal",
        borderWidth: 0,
      },
    },
    legend: { enabled: false },
    series: [
      {
        name: "Reconversion du site",
        type: "area",
        data: [
          roundTo2Digits(fullTimeJobsImpact.conversion.current),
          roundTo2Digits(fullTimeJobsImpact.conversion.forecast),
        ],
      },
      {
        name: "Exploitation du site",
        type: "area",
        data: [
          roundTo2Digits(fullTimeJobsImpact.operations.current),
          roundTo2Digits(fullTimeJobsImpact.operations.forecast),
        ],
      },
    ],
  };

  const totalDifference = fullTimeJobsImpact.forecast - fullTimeJobsImpact.current;

  return (
    <ImpactCard title="🧑‍🔧 Emplois équivalent temps plein">
      <div style={{ textAlign: "center" }}>
        {totalDifference >= 0 && "+"}
        {formatNumberFr(totalDifference)} ETP
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default FullTimeJobsImpactCard;
