import { Options } from "highcharts";
import { useId, useMemo } from "react";
import { typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearer } from "@/features/projects/application/project-impacts/projectBreakEvenLevel.selectors";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import ImpactChartCard from "../../project-page/impacts/charts-view/ImpactChartCard/ImpactChartCard";
import { formatMonetaryImpact } from "../../shared/formatImpactValue";

type Props = {
  indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearer;
  indirectEconomicImpactsTotal: number;
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

const getLabelForBearer = (name: keyof IndirectEconomicImpactsByBearer) => {
  switch (name) {
    case "local_authority":
      return "Collectivité";
    case "local_people_or_company":
      return "Riverains";
    case "humanity":
      return "Société française et mondiale";
  }
};

const getColorForBearer = (name: keyof IndirectEconomicImpactsByBearer) => {
  switch (name) {
    case "local_authority":
      return "#1D5DA2";
    case "local_people_or_company":
      return "#FD7CC5";
    case "humanity":
      return "#9EE24B";
  }
};

export default function IndirectEconomicImpactsChart({
  indirectEconomicImpactsByBearer,
  indirectEconomicImpactsTotal,
}: Props) {
  const data = useMemo(() => {
    return typedObjectEntries(indirectEconomicImpactsByBearer)
      .map(([bearer, total]) => ({
        name: getLabelForBearer(bearer),
        y: total,
        color: getColorForBearer(bearer),
      }))
      .filter(({ y }) => y !== 0);
  }, [indirectEconomicImpactsByBearer]);

  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <ImpactChartCard
      containerProps={{
        className: "highcharts-no-xaxis",
        id: chartContainerId,
      }}
      title="👥 Impacts socio-économiques"
      options={
        {
          ...barChartOptions,
          subtitle: {
            useHTML: true,
            text: `<span class='text-sm py-4'>Montant total des impacts : <span class='font-bold ${getPositiveNegativeTextClassesFromValue(indirectEconomicImpactsTotal)}'>${formatMonetaryImpact(indirectEconomicImpactsTotal)}</span>`,
            verticalAlign: "bottom",
            align: "left",
          },
          xAxis: {
            categories: data.map(({ name }) => name),
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
