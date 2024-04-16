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
  permeableSurfaceImpact: {
    base: number;
    forecast: number;
    greenSoil: {
      base: number;
      forecast: number;
    };
    mineralSoil: {
      base: number;
      forecast: number;
    };
  };
  onTitleClick: () => void;
};

function PermeableSurfaceImpactCard({
  reconversionProjectName,
  permeableSurfaceImpact,
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
    plotOptions: {
      area: {
        stacking: "normal",
      },
    },
    legend: { enabled: false },
    series: [
      {
        name: "Surface minérale",
        type: "area",
        data: [
          roundTo2Digits(permeableSurfaceImpact.mineralSoil.base),
          roundTo2Digits(permeableSurfaceImpact.mineralSoil.forecast),
        ],
      },
      {
        name: "Surface végétalisée",
        type: "area",
        data: [
          roundTo2Digits(permeableSurfaceImpact.greenSoil.base),
          roundTo2Digits(permeableSurfaceImpact.greenSoil.forecast),
        ],
      },
    ],
  };

  const totalDifference = permeableSurfaceImpact.forecast - permeableSurfaceImpact.base;
  const percentageVariation = getPercentageDifference(
    permeableSurfaceImpact.base,
    permeableSurfaceImpact.forecast,
  );
  return (
    <ImpactCard title="🌧 Surfaces perméables" onTitleClick={onTitleClick}>
      <ImpactPercentageVariation percentage={percentageVariation} />
      <ImpactAbsoluteVariation>{formatSurfaceAreaImpact(totalDifference)}</ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default PermeableSurfaceImpactCard;
