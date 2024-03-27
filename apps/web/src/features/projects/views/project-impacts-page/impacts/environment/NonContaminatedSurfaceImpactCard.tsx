import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseAreaChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";
import { formatSurfaceAreaImpact } from "../../list-view/formatImpactValue";

import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  reconversionProjectName: string;
  nonContaminatedSurfaceImpact: {
    current: number;
    forecast: number;
  };
};

function NonContaminatedSurfaceImpactCard({
  reconversionProjectName,
  nonContaminatedSurfaceImpact,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      categories: ["Pas de changement", reconversionProjectName],
    },
    tooltip: {
      valueSuffix: `&nbsp;${SQUARE_METERS_HTML_SYMBOL}`,
    },
    plotOptions: {
      area: {
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Surface non polluée",
        type: "area",
        data: [
          roundTo2Digits(nonContaminatedSurfaceImpact.current),
          roundTo2Digits(nonContaminatedSurfaceImpact.forecast),
        ],
        showInLegend: false,
      },
    ],
  };

  const totalDifference =
    nonContaminatedSurfaceImpact.forecast - nonContaminatedSurfaceImpact.current;
  return (
    <ImpactCard title="✨ Surface non polluée">
      <div style={{ textAlign: "center" }}>{formatSurfaceAreaImpact(totalDifference)}</div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default NonContaminatedSurfaceImpactCard;
