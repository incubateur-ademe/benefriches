import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseAreaChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  reconversionProjectName: string;
  accidentsImpact: {
    current: number;
    forecast: 0;
    severeInjuries: {
      current: number;
      forecast: 0;
    };
    minorInjuries: {
      current: number;
      forecast: 0;
    };
    deaths: {
      current: number;
      forecast: 0;
    };
  };
};

const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

function AccidentsImpactCard({ reconversionProjectName, accidentsImpact }: Props) {
  const series: Highcharts.SeriesOptionsType[] = [];

  if (accidentsImpact.minorInjuries.current) {
    series.push({
      name: "Blessés légers",
      type: "area",
      data: [
        roundTo2Digits(accidentsImpact.minorInjuries.current),
        roundTo2Digits(accidentsImpact.minorInjuries.forecast),
      ],
    });
  }
  if (accidentsImpact.severeInjuries.current) {
    series.push({
      name: "Blessés graves",
      type: "area",
      data: [
        roundTo2Digits(accidentsImpact.severeInjuries.current),
        roundTo2Digits(accidentsImpact.severeInjuries.forecast),
      ],
    });
  }
  if (accidentsImpact.deaths.current) {
    series.push({
      name: "Décès",
      type: "area",
      data: [
        roundTo2Digits(accidentsImpact.deaths.current),
        roundTo2Digits(accidentsImpact.deaths.forecast),
      ],
    });
  }

  const areaChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
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
    series,
  };

  return (
    <ImpactCard title="💥 Accidents évités sur la friche">
      <div style={{ textAlign: "center" }}>
        +{formatNumberFr(accidentsImpact.current)} accidents évités
      </div>
      <HighchartsReact highcharts={Highcharts} options={areaChartOptions} />
    </ImpactCard>
  );
}

export default AccidentsImpactCard;
