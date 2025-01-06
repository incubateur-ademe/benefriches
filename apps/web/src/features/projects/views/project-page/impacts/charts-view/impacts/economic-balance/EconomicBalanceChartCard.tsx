import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { roundTo2Digits } from "shared";
import { sumList } from "shared";

import {
  EconomicBalance,
  EconomicBalanceMainName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import HighchartBarColoredChart from "@/features/projects/views/project-page/impacts/charts-view/ImpactChartCard/ImpactBarColoredBalanceChart";
import { getEconomicBalanceImpactLabel } from "@/features/projects/views/project-page/impacts/getImpactLabel";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ImpactChartTooltipContent from "../../ImpactChartCard/ImpactChartTooltipContent";
import ImpactsChartsSection from "../../ImpactsChartsSection";

type Props = {
  economicBalance: EconomicBalance["economicBalance"];
  bearer?: string;
  onClick: () => void;
};

const getEconomicBalanceImpactColor = (name: EconomicBalanceMainName) => {
  switch (name) {
    case "site_resale":
      return "#8DC85D";
    case "site_purchase":
      return "#8DC85D";
    case "site_reinstatement":
      return "#FFBE04";
    case "financial_assistance":
      return "#ECE54C";
    case "development_plan_installation":
      return "#F9E2B8";
    case "photovoltaic_development_plan_installation":
      return "#FF9700";
    case "urban_project_development_plan_installation":
      return "#E9452B";
    case "operations_costs":
      return "#8D9BA3";
    case "operations_revenues":
      return "#D5B250";
  }
};

function EconomicBalanceChartCard({ economicBalance, onClick, bearer = "l'aménageur" }: Props) {
  const totalValues = economicBalance.map(({ value }) => value);

  const totalRevenues = sumList(totalValues.filter((value) => value > 0));
  const totalExpenses = sumList(totalValues.filter((value) => value < 0));

  return (
    <ImpactsChartsSection
      title="Bilan de l'opération"
      subtitle={`Pour ${bearer}`}
      onClick={onClick}
    >
      {economicBalance.length === 0 ? (
        <div>Vous n'avez pas renseigné de dépenses ni de recettes pour ce projet.</div>
      ) : (
        <Tooltip
          kind="hover"
          title={
            <ImpactChartTooltipContent
              rows={economicBalance.map(({ value, name }) => ({
                label: getEconomicBalanceImpactLabel(name),
                color: getEconomicBalanceImpactColor(name),
                value: value,
                valueText: formatMonetaryImpact(value),
              }))}
            />
          }
        >
          <HighchartBarColoredChart
            categoryLabels={[
              `<strong>Dépenses</strong><br>${formatMonetaryImpact(totalExpenses)}`,
              `<strong>Recettes</strong><br>${formatMonetaryImpact(totalRevenues)}`,
            ]}
            data={economicBalance.map(({ value, name }) => {
              return {
                label: getEconomicBalanceImpactLabel(name),
                color: getEconomicBalanceImpactColor(name),
                values: value > 0 ? [0, roundTo2Digits(value)] : [roundTo2Digits(value), 0],
              };
            })}
          />
        </Tooltip>
      )}
    </ImpactsChartsSection>
  );
}

export default EconomicBalanceChartCard;
