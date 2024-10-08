import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
import classNames from "@/shared/views/clsx";
import HighchartsMainColorsBehoreHover from "@/shared/views/components/Charts/HighchartsMainColorsBehoreHover";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
  formatTimeImpact,
  impactFormatConfig,
} from "../../../../shared/formatImpactValue";
import ImpactChartTooltip from "./ImpactChartTooltip";
import ImpactPercentageVariation from "./ImpactPercentageVariation";

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

const getMaxDetailsDifferenceIndex = (
  data: { impactLabel: string; base: number; forecast: number }[],
) => {
  const differences = data.map(({ base, forecast }) => forecast - base);

  return differences.indexOf(Math.max(...differences));
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
  const percentageVariation = getPercentageDifference(base, forecast);

  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: [baseLabel, forecastLabel],
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      area: {
        ...baseAreaChartConfig.plotOptions?.area,
        stacking: "normal",
        marker: { enabled: false, states: { hover: { enabled: false } } },
      },
      series: {
        enableMouseTracking: false,
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

  return (
    <HighchartsMainColorsBehoreHover
      colors={data.map(() => getMaxDetailsDifferenceIndex(data))}
      aria-describedby={`tooltip-${impactLabel}`}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
      <h4 className="tw-text-sm tw-text-center tw-mb-1">{impactLabel}</h4>
      <div className={classNames(fr.cx("fr-text--sm", "fr-m-0"), "tw-text-center")}>
        {impactTypeFormatterMap[type].formatFn(difference)}
        {unitSuffix}

        <ImpactPercentageVariation
          percentage={percentageVariation > 10000 ? 9999 : percentageVariation}
        />
      </div>
      <ImpactChartTooltip
        tooltipId={`tooltip-${impactLabel}`}
        rows={data.map(({ impactLabel, base, forecast }) => ({
          label: impactLabel,
          value: forecast - base,
          valueText: impactTypeFormatterMap[type].formatFn(forecast - base),
        }))}
      />
    </HighchartsMainColorsBehoreHover>
  );
}

export default ImpactAreaChartCard;
