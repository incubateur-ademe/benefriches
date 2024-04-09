import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

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
      labels: { enabled: false },
      categories: ["Pas de changement", reconversionProjectName],
    },
    tooltip: {
      valueSuffix: ` ETP`,
    },
    legend: { enabled: false },
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
      <ImpactPercentageVariation percentage={100} />
      <ImpactAbsoluteVariation>
        {formatDefaultImpact(accidentsImpact.current)}
      </ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={areaChartOptions} />
    </ImpactCard>
  );
}

export default AccidentsImpactCard;
