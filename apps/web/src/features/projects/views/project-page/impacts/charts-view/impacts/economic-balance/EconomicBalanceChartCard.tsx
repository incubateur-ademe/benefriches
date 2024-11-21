import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundTo2Digits } from "shared";
import { sumList } from "shared";

import {
  EconomicBalance,
  EconomicBalanceMainName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import { getEconomicBalanceImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import HighchartsCustomColorsWrapper from "@/shared/views/components/Charts/HighchartsCustomColorsWrapper";
import HighchartsMainColorsBehoreHover from "@/shared/views/components/Charts/HighchartsMainColorsBehoreHover";

import ImpactChartTooltip from "../../ImpactChartCard/ImpactChartTooltip";
import ImpactsChartsSection from "../../ImpactsChartsSection";

type Props = {
  economicBalance: EconomicBalance["economicBalance"];
  bearer?: string;
  onClick: () => void;
};

const getEconomicBalanceImpactColor = (name: EconomicBalanceMainName) => {
  switch (name) {
    case "site_resale":
      return "#72D98D";
    case "site_purchase":
      return "#F3F511";
    case "site_reinstatement":
      return "#F4C00A";
    case "financial_assistance":
      return "#14EA81";
    case "development_plan_installation":
      return "#F57F0A";
    case "photovoltaic_development_plan_installation":
      return "#EF410F";
    case "urban_project_development_plan_installation":
      return "#DA244F";
    case "operations_costs":
      return "#C535A4";
    case "operations_revenues":
      return "#37C95D";
  }
};

function EconomicBalanceChartCard({ economicBalance, onClick, bearer = "Aménageur" }: Props) {
  const totalValues = economicBalance.map(({ value }) => value);

  const totalRevenues = sumList(totalValues.filter((value) => value > 0));
  const totalExpenses = sumList(totalValues.filter((value) => value < 0));

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [
        `<strong>Dépenses</strong><br>${formatMonetaryImpact(totalExpenses)}`,
        `<strong>Recettes</strong><br>${formatMonetaryImpact(totalRevenues)}`,
      ],
      opposite: true,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
      series: {
        enableMouseTracking: false,
      },
    },
    legend: {
      enabled: false,
    },
    series: economicBalance.map(({ value, name }) => {
      const point = {
        y: roundTo2Digits(value),
        customTooltip: `${bearer} : ${formatMonetaryImpact(value)}`,
      };

      return {
        name: getEconomicBalanceImpactLabel(name),
        data: value > 0 ? [0, point] : [point, 0],
        type: "column",
      };
    }) as Array<Highcharts.SeriesOptionsType>,
  };

  const economicBalanceValues = economicBalance.map(({ value }) => value);
  const maxIndexValue = economicBalanceValues.indexOf(Math.max(...economicBalanceValues));
  const minIndexValue = economicBalanceValues.indexOf(Math.min(...economicBalanceValues));

  return (
    <ImpactsChartsSection title="Bilan de l'opération" onClick={onClick}>
      {economicBalance.length === 0 ? (
        <div>Vous n'avez pas renseigné de dépenses ni de recettes pour ce projet.</div>
      ) : (
        <HighchartsCustomColorsWrapper
          colors={economicBalance.map(({ name }) => getEconomicBalanceImpactColor(name))}
        >
          <HighchartsMainColorsBehoreHover
            colors={economicBalance.map(({ value }) => (value > 0 ? maxIndexValue : minIndexValue))}
            aria-describedby={`tooltip-economic-balance`}
          >
            <HighchartsReact
              containerProps={{ className: "highcharts-no-xaxis" }}
              highcharts={Highcharts}
              options={barChartOptions}
            />

            <ImpactChartTooltip
              tooltipId={`tooltip-economic-balance`}
              rows={economicBalance.map(({ value, name }) => ({
                label: getEconomicBalanceImpactLabel(name),
                value: value,
                valueText: formatMonetaryImpact(value),
              }))}
            />
          </HighchartsMainColorsBehoreHover>
        </HighchartsCustomColorsWrapper>
      )}
    </ImpactsChartsSection>
  );
}

export default EconomicBalanceChartCard;
