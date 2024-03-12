import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

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

const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

function FullTimeJobsImpactCard({ reconversionProjectName, fullTimeJobsImpact }: Props) {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
      type: "area",
      height: "240",
    },
    xAxis: {
      categories: ["Pas de changement", reconversionProjectName],
    },
    yAxis: {
      visible: false,
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
