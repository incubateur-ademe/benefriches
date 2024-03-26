import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseAreaChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
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
};

function PermeableSurfaceImpactCard({ reconversionProjectName, permeableSurfaceImpact }: Props) {
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
        stacking: "normal",
        borderWidth: 0,
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

  const totalDifference = permeableSurfaceImpact.forecast - permeableSurfaceImpact.base;
  return (
    <ImpactCard title="🌧 Surfaces perméables">
      <div style={{ textAlign: "center" }}>
        {totalDifference >= 0 && "+"}
        {formatNumberFr(totalDifference)} {SQUARE_METERS_HTML_SYMBOL}
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default PermeableSurfaceImpactCard;
