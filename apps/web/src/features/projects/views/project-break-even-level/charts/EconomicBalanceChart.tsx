import { Options } from "highcharts";
import { useId, useMemo } from "react";
import { GetReconversionProjectImpactsResultDto, sumListWithKey } from "shared";

import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import ImpactChartCard from "../../shared/charts/ImpactChartCard";
import { formatMonetaryImpact } from "../../shared/formatImpactValue";

type Props = Pick<GetReconversionProjectImpactsResultDto["impacts"], "projectEconomicBalance"> & {
  dialogId: string;
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

const getLabelForName = (
  name: Props["projectEconomicBalance"]["details"][number]["name"],
): string => {
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
    case "projectBuildingsInstallation":
      return "Construction et réhabilitation des bâtiments";
  }
};

export const getColorForName = (
  name: Props["projectEconomicBalance"]["details"][number]["name"],
): string => {
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
    case "projectBuildingsInstallation":
      return "#854C1B";
  }
};
const sumForCategory = (
  data: Props["projectEconomicBalance"]["details"],
  name: Props["projectEconomicBalance"]["details"][number]["name"],
) => {
  return sumListWithKey(
    data.filter((item) => item.name === name),
    "total",
  );
};

export default function EconomicBalanceChart({ projectEconomicBalance, dialogId }: Props) {
  const categories = useMemo(
    () => Array.from(new Set(projectEconomicBalance.details.map(({ name }) => name))),
    [projectEconomicBalance],
  );

  const data = useMemo(
    () =>
      categories.map((category) => ({
        name: getLabelForName(category),
        y: sumForCategory(projectEconomicBalance.details, category),
        color: getColorForName(category),
      })),
    [categories, projectEconomicBalance],
  );
  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <ImpactChartCard
      dialogId={dialogId}
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
            text: `<span class='text-sm py-4'>Bilan total de l’opération : <span class='font-bold ${getPositiveNegativeTextClassesFromValue(projectEconomicBalance.total)}'>${formatMonetaryImpact(projectEconomicBalance.total)}</span>`,
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
