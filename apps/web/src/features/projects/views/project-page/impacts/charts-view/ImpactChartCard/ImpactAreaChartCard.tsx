import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
  formatTimeImpact,
  impactFormatConfig,
} from "../../../../shared/formatImpactValue";
import ImpactAbsoluteVariation from "./ImpactAbsoluteVariation";
import ImpactChartCard from "./ImpactChartCard";
import ImpactPercentageVariation from "./ImpactPercentageVariation";

import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";

const impactTypeFormatterMap = {
  co2: { ...impactFormatConfig["co2"], formatFn: formatCO2Impact },
  monetary: { formatFn: formatMonetaryImpact, ...impactFormatConfig["monetary"] },
  surfaceArea: {
    formatFn: formatSurfaceAreaImpact,
    ...impactFormatConfig["surface_area"],
  },
  etp: {
    formatFn: formatETPImpact,
    ...impactFormatConfig["etp"],
  },
  time: {
    formatFn: formatTimeImpact,
    ...impactFormatConfig["time"],
  },
  default: { formatFn: formatDefaultImpact, ...impactFormatConfig["default"] },
} as const;

type Props = {
  baseLabel: string;
  forecastLabel: string;
  onClick?: () => void;
  impact: {
    impactLabel: string;
    base: number;
    forecast: number;
    difference: number;
    data: { impactLabel: string; base: number; forecast: number }[];
  };
  type: "surfaceArea" | "monetary" | "co2" | "etp" | "time" | "default" | undefined;
  unitSuffix?: string;
};

function ImpactAreaChartCard({
  type = "default",
  baseLabel,
  forecastLabel,
  impact,
  onClick,
  unitSuffix,
}: Props) {
  const { data, base, forecast, difference, impactLabel } = impact;

  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: [baseLabel, forecastLabel],
    },
    tooltip: {
      valueSuffix: `&nbsp;${unitSuffix ?? impactTypeFormatterMap[type].unitSuffix}`,
      pointFormat: "{series.name}: <b>{point.y}</b><br/>",
      outside: true,
    },
    plotOptions: {
      area: {
        ...baseAreaChartConfig.plotOptions?.area,
        stacking: "normal",
      },
    },
    legend: { enabled: false },
    series: data.map((data) => ({
      name: data.impactLabel,
      type: "area",
      data: [
        impactTypeFormatterMap[type].roundFn(data.base),
        impactTypeFormatterMap[type].roundFn(data.forecast),
      ],
    })) as Array<Highcharts.SeriesOptionsType>,
  };

  const percentageVariation = getPercentageDifference(base, forecast);

  return (
    <ImpactChartCard title={impactLabel} onClick={onClick}>
      <ImpactPercentageVariation
        percentage={percentageVariation > 10000 ? 9999 : percentageVariation}
      />
      <ImpactAbsoluteVariation>
        {impactTypeFormatterMap[type].formatFn(difference)}
        {unitSuffix}
      </ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactChartCard>
  );
}

export default ImpactAreaChartCard;
