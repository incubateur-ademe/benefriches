import * as Highcharts from "highcharts";
import { Options } from "highcharts";
import { useId } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

import ImpactChartCard from "./ImpactChartCard";
import "./ImpactChartCard.css";

type Props = {
  title: string;
  subtitle?: string;
  dialogId: string;
  data: {
    label: string;
    color?: string;
    value: number;
  }[];
  formatFn?: (value: number) => string;
};

const barChartOptions: Options = withDefaultBarChartOptions({
  tooltip: {
    enabled: false,
  },
  chart: {
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
    spacingTop: 0,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: false,
      },
      colorByPoint: true,
    },
  },
  legend: {
    enabled: false,
  },
});

const ImpactColumnChartCard = ({
  title,
  subtitle,
  data,
  formatFn = formatMonetaryImpact,
  dialogId,
}: Props) => {
  const chartContainerId = useId();

  useChartCustomPointColors(
    chartContainerId,
    data.map(({ color }) => color),
  );

  return (
    <ImpactChartCard
      dialogId={dialogId}
      containerProps={{
        id: chartContainerId,
        className: ["highcharts-no-xaxis", "column-chart"],
      }}
      options={
        {
          ...barChartOptions,
          title: { text: title, align: "left", useHTML: true },
          subtitle: { text: subtitle, align: "left", useHTML: true },
          xAxis: {
            categories: data.map(({ label }) => label),
            labels: {
              formatter: function () {
                return `<strong>${this.value}</strong><br>${formatFn(data[this.pos]?.value ?? 0)}`;
              },
            },
          },
          series: [
            {
              type: "column",
              name: "Montant (en €)",
              data: data.map(({ value, label }) => ({
                name: label,
                y: value,
              })),
            },
          ],
        } as Highcharts.Options
      }
      exportingOptions={{
        colors: data.map(({ color }) => color),
        chartOptions: { xAxis: { lineWidth: 0 } },
      }}
    />
  );
};

export default ImpactColumnChartCard;
