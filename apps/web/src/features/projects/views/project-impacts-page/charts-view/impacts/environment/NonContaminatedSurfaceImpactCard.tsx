import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { formatSurfaceAreaImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  reconversionProjectName: string;
  nonContaminatedSurfaceImpact: {
    current: number;
    forecast: number;
  };
  onTitleClick: () => void;
};

function NonContaminatedSurfaceImpactCard({
  reconversionProjectName,
  nonContaminatedSurfaceImpact,
  onTitleClick,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: ["Pas de changement", reconversionProjectName],
    },
    tooltip: {
      valueSuffix: `&nbsp;${SQUARE_METERS_HTML_SYMBOL}`,
    },
    legend: { enabled: false },
    series: [
      {
        name: "Surface non polluée",
        type: "area",
        data: [
          roundTo2Digits(nonContaminatedSurfaceImpact.current),
          roundTo2Digits(nonContaminatedSurfaceImpact.forecast),
        ],
      },
    ],
  };

  const totalDifference =
    nonContaminatedSurfaceImpact.forecast - nonContaminatedSurfaceImpact.current;
  const percentageVariation = getPercentageDifference(
    nonContaminatedSurfaceImpact.current,
    nonContaminatedSurfaceImpact.forecast,
  );
  return (
    <ImpactCard title="✨ Surface non polluée" onTitleClick={onTitleClick}>
      <ImpactPercentageVariation percentage={percentageVariation} />
      <ImpactAbsoluteVariation>{formatSurfaceAreaImpact(totalDifference)}</ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default NonContaminatedSurfaceImpactCard;
