import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  reconversionProjectName: string;
  contaminatedSurfaceImpact: {
    base: number;
    forecast: number;
  };
};

const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

function ContaminatedSurfaceImpactCard({
  reconversionProjectName,
  contaminatedSurfaceImpact,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
      type: "area",
      height: "240",
    },
    xAxis: {
      categories: ["Pas de changement", reconversionProjectName],
      crosshair: false,
    },
    yAxis: {
      visible: false,
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
        name: "Surface polluée",
        type: "area",
        data: [
          roundTo2Digits(contaminatedSurfaceImpact.base),
          roundTo2Digits(contaminatedSurfaceImpact.forecast),
        ],
        showInLegend: false,
      },
    ],
  };

  const totalDifference = contaminatedSurfaceImpact.forecast - contaminatedSurfaceImpact.base;
  return (
    <ImpactCard title="✨ Surface polluée">
      <div style={{ textAlign: "center" }}>
        {totalDifference >= 0 && "+"}
        {formatNumberFr(totalDifference)} {SQUARE_METERS_HTML_SYMBOL}
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default ContaminatedSurfaceImpactCard;
