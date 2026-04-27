import { Options } from "highcharts";
import { useMemo } from "react";
import { ReconversionProjectImpactsBreakEvenLevel, sumListWithKey } from "shared";

import { withDefaultBarChartOptions } from "@/shared/views/charts";
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
      })),
    [categories, economicBalance],
  );

  return (
    <ImpactChartCard
      containerProps={{
        className: "highcharts-no-xaxis",
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
      }}
    />
  );
}
