import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  reconversionProjectName: string;
  permeableSurfaceImpact: {
    base: number;
    forecast: number;
    difference: number;
    greenSoil: {
      base: number;
      forecast: number;
      difference: number;
    };
    mineralSoil: {
      base: number;
      forecast: number;
      difference: number;
    };
  };
};

const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

function PermeableSurfaceImpactCard({ reconversionProjectName, permeableSurfaceImpact }: Props) {
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
      valueSuffix: `&nbsp;${SQUARE_METERS_HTML_SYMBOL}`,
    },
    plotOptions: {
      area: {
        stacking: "normal",
        borderWidth: 0,
        // dataLabels: { enabled: false, format: `{point.y:,.0f} ${SQUARE_METERS_HTML_SYMBOL}` },
      },
    },
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

  return (
    <ImpactCard title="🌧 Surfaces perméables">
      <div style={{ textAlign: "center" }}>
        {permeableSurfaceImpact.difference >= 0 && "+"}
        {formatNumberFr(permeableSurfaceImpact.difference)} {SQUARE_METERS_HTML_SYMBOL}
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default PermeableSurfaceImpactCard;
