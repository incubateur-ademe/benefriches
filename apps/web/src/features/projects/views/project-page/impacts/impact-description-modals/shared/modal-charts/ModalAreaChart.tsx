import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useId } from "react";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultAreaChartOptions } from "@/shared/views/charts";
import { useChartCustomSerieColors } from "@/shared/views/charts/useChartCustomColors";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

type Props = {
  title: string;
  base: number;
  forecast: number;
  difference: number;
  color?: string;
  details?: { label: string; base: number; forecast: number; difference: number; color?: string }[];
  type?: "co2" | "surfaceArea" | "etp" | "default";
};

const barAreaChartOptions: Highcharts.Options = withDefaultAreaChartOptions({
  chart: {
    type: "area",
    height: 300,
    marginLeft: 0,
    marginRight: 0,
    styledMode: true,
  },
  xAxis: {
    labels: { enabled: true },
    categories: [],
  },
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    area: {
      stacking: "normal",
      marker: { enabled: false, states: { hover: { enabled: false } } },
      lineWidth: 0,
    },
    series: {
      enableMouseTracking: false,
    },
  },
  legend: { enabled: false },
});

const impactTypeFormatterMap = {
  co2: {
    formatFn: formatCO2Impact,
    unitSuffix: "",
  },
  surfaceArea: {
    formatFn: formatSurfaceAreaImpact,
    unitSuffix: "",
  },
  etp: {
    formatFn: formatETPImpact,
    unitSuffix: "ETP",
  },
  default: {
    formatFn: formatDefaultImpact,
    unitSuffix: "",
  },
} as const;

const ModalAreaChart = ({
  base,
  forecast,
  difference,
  color,
  details,
  title,
  type = "default",
}: Props) => {
  const chartContainerId = useId();

  const { formatFn, unitSuffix } = impactTypeFormatterMap[type];

  const baseValueText = `${formatFn(base, { withSignPrefix: false })} ${unitSuffix}`;
  const forecastValueText = `${formatFn(forecast, { withSignPrefix: false })} ${unitSuffix}`;

  const data = details?.filter(({ difference }) => difference !== 0) ?? [
    {
      label: title,
      base,
      forecast,
      difference,
      color,
    },
  ];

  useChartCustomSerieColors(
    chartContainerId,
    data.map(({ color }) => color),
  );

  return (
    <Tooltip
      kind="hover"
      title={
        <div className="!tw-text-xs">
          {data.map(({ label, difference, color }) => (
            <div
              key={label}
              className="tw-py-1 tw-flex tw-justify-between tw-items-center tw-gap-2"
            >
              <div className="tw-flex tw-items-center tw-gap-2">
                <span
                  className="tw-min-h-3 tw-min-w-3 tw-rounded"
                  style={color ? { backgroundColor: color } : {}}
                ></span>
                <span>{label}</span>
              </div>

              <span className={getPositiveNegativeTextClassesFromValue(difference)}>
                {`${formatFn(difference)} ${unitSuffix}`}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{ id: chartContainerId }}
        options={
          {
            ...barAreaChartOptions,
            xAxis: {
              categories: ["Sans le projet", "Avec le projet"],
              labels: {
                useHTML: true,
                formatter: function () {
                  return `<strong>${this.value}</strong><br>${this.isFirst ? baseValueText : forecastValueText}`;
                },
              },
            },
            series: data.map(({ label, base, forecast, color }) => ({
              name: label,
              type: "area",
              color,
              data: [base, forecast],
            })) as Array<Highcharts.SeriesOptionsType>,
          } as Highcharts.Options
        }
      />
    </Tooltip>
  );
};

export default ModalAreaChart;
