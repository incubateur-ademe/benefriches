import { Options } from "highcharts";
import { useId, useMemo } from "react";
import { ReconversionProjectImpactsBreakEvenLevel, sumListWithKey } from "shared";

import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import ImpactChartCard from "../../project-page/impacts/charts-view/ImpactChartCard/ImpactChartCard";
import { formatMonetaryImpact } from "../../shared/formatImpactValue";

type Props = Pick<ReconversionProjectImpactsBreakEvenLevel, "economicBalance">;

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

const getLabelForName = (name: Props["economicBalance"]["details"][number]["name"]) => {
  switch (name) {
    case "projectInstallation":
      return "Aménagement du site";
    case "sitePurchase":
      return "Achat du site";
    case "buildingsResaleRevenue":
      return "Revente des bâtiments";
    case "financialAssistanceRevenues":
      return "Aides et subventions";
    case "siteReinstatement":
      return "Remise en état du site";
    case "siteResaleRevenue":
      return "Revente du site";
    case "projectOperatingEconomicBalance":
      return "Exploitation du site";
  }
};

export const getColorForName = (name: Props["economicBalance"]["details"][number]["name"]) => {
  switch (name) {
    case "projectInstallation":
      return "#E02727";
    case "sitePurchase":
      return "#B4D21E";
    case "buildingsResaleRevenue":
      return "#B4D21E";
    case "financialAssistanceRevenues":
      return "#1BBB36";
    case "siteReinstatement":
      return "#E02727";
    case "siteResaleRevenue":
      return "#1BBB36";
    case "projectOperatingEconomicBalance":
      return "#E0A227";
  }
};
const sumForCategory = (
  data: Props["economicBalance"]["details"],
  name: Props["economicBalance"]["details"][number]["name"],
) => {
  return sumListWithKey(
    data.filter((item) => item.name === name),
    "total",
  );
};

export default function EconomicBalanceChart({ economicBalance }: Props) {
  const categories = useMemo(
    () => Array.from(new Set(economicBalance.details.map(({ name }) => name))),
    [economicBalance],
  );

  const data = useMemo(
    () =>
      categories.map((category) => ({
        name: getLabelForName(category),
        y: sumForCategory(economicBalance.details, category),
        color: getColorForName(category),
      })),
    [categories, economicBalance],
  );
  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <ImpactChartCard
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
            text: `<span class='text-sm py-4'>Bilan total de l’opération : <span class='font-bold ${getPositiveNegativeTextClassesFromValue(economicBalance.total)}'>${formatMonetaryImpact(economicBalance.total)}</span>`,
            verticalAlign: "bottom",
            align: "left",
          },
          xAxis: {
            categories: categories,
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
