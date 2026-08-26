import { Options } from "highcharts";
import { useId, useMemo } from "react";
import { Link } from "type-route";

import { EconomicBalanceByCategory } from "@/features/projects/core/projectImpactsEconomicBalance";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import { getEconomicBalanceImpactColor } from "../../impact-description-modals/colors";
import ImpactChartCard from "../../shared/charts/ImpactChartCard";
import { formatMonetaryImpact } from "../../shared/formatImpactValue";
import { getEconomicBalanceImpactLabel } from "../../shared/getImpactLabel";

type Props = {
  projectEconomicBalanceByCategory: EconomicBalanceByCategory;
  linkProps?: Link;
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
    height: 328,
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

export default function EconomicBalanceChart({
  projectEconomicBalanceByCategory,
  linkProps,
}: Props) {
  const data = useMemo(
    () =>
      projectEconomicBalanceByCategory.economicBalance.map((item) => ({
        name: getEconomicBalanceImpactLabel(item.keyName),
        y: item.total,
        color: getEconomicBalanceImpactColor(item.keyName),
      })),
    [projectEconomicBalanceByCategory],
  );
  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <ImpactChartCard
      linkProps={linkProps}
      containerProps={{
        className: "highcharts-no-xaxis",
        id: chartContainerId,
      }}
      title="💰 Bilan de l’opération"
      options={
        {
          ...barChartOptions,
          subtitle: {
            useHTML: true,
            text: `<span class='text-sm py-4'>Bilan total de l’opération : <span class='font-bold ${getPositiveNegativeTextClassesFromValue(projectEconomicBalanceByCategory.total)}'>${formatMonetaryImpact(projectEconomicBalanceByCategory.total)}</span>`,
            verticalAlign: "bottom",
            align: "left",
          },
          xAxis: {
            categories: data.map((item) => item.name),
            labels: {
              formatter: function () {
                return `<strong>${data[this.pos]?.name}</strong><br>${formatMonetaryImpact(data[this.pos]?.y ?? 0)}`;
              },
            },
          },

          series: [
            {
              type: "column",
              name: "Montant (en €)",
              data,
            },
          ],
        } as Highcharts.Options
      }
      exportingOptions={{
        chartOptions: { xAxis: { lineWidth: 0 } },
        colors,
      }}
    />
  );
}
