import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
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
        ...baseAreaChartConfig.plotOptions?.area,
        stacking: "normal",
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
  const totalDifferenceInPercentage = getPercentageDifference(
    fullTimeJobsImpact.current,
    fullTimeJobsImpact.forecast,
  );

  return (
    <ImpactCard title="🧑‍🔧 Emplois équivalent temps plein">
      <ImpactPercentageVariation percentage={totalDifferenceInPercentage} />
      <ImpactAbsoluteVariation>{formatDefaultImpact(totalDifference)}</ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default FullTimeJobsImpactCard;
