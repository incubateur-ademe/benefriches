import { useContext } from "react";
import { roundTo2Digits } from "shared";

import {
  EconomicBalance,
  EconomicBalanceMainName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import ImpactColumnChart from "@/features/projects/views/project-page/impacts/charts-view/ImpactChartCard/ImpactColumnChart";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { ImpactModalDescriptionContext } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactsChartsSection from "../../ImpactsChartsSection";

type Props = {
  economicBalance: EconomicBalance["economicBalance"];
  bearer?: string;
};

const getEconomicBalanceImpactColor = (name: EconomicBalanceMainName): string => {
  switch (name) {
    case "buildings_resale":
    case "site_resale":
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

const getEconomicBalanceImpactLabel = (name: EconomicBalanceMainName): string => {
  switch (name) {
    case "site_purchase":
      return "Acquisition du site";
    case "site_resale":
      return "Cession du site";
    case "site_reinstatement":
      return "Remise en état de la friche";
    case "financial_assistance":
      return "Aides financières";
    case "development_plan_installation":
      return "Aménagement du projet";
    case "photovoltaic_development_plan_installation":
      return "⚡️ Installation des panneaux photovoltaïques";
    case "urban_project_development_plan_installation":
      return "Aménagement du site";
    case "operations_costs":
      return "Charges d'exploitation";
    case "operations_revenues":
      return "Recettes d'exploitation";
    case "buildings_resale":
      return "Cession des bâtiments";
  }
};

function EconomicBalanceChartCard({ economicBalance, bearer = "l'aménageur" }: Props) {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactsChartsSection
      title="Bilan de l'opération"
      subtitle={`Pour ${bearer}`}
      onClick={() => {
        openImpactModalDescription({ sectionName: "economic_balance" });
      }}
    >
      {economicBalance.length === 0 ? (
        <div>Vous n'avez pas renseigné de dépenses ni de recettes pour ce projet.</div>
      ) : (
        <ImpactColumnChart
          formatFn={formatMonetaryImpact}
          data={[
            {
              label: "Recettes",
              values: economicBalance
                .filter(({ value }) => value > 0)
                .map(({ value, name }) => ({
                  label: getEconomicBalanceImpactLabel(name),
                  color: getEconomicBalanceImpactColor(name),
                  value: roundTo2Digits(value),
                })),
            },
            {
              label: "Dépenses",
              values: economicBalance
                .filter(({ value }) => value < 0)
                .map(({ value, name }) => ({
                  label: getEconomicBalanceImpactLabel(name),
                  color: getEconomicBalanceImpactColor(name),
                  value: roundTo2Digits(value),
                })),
            },
          ]}
        />
      )}
    </ImpactsChartsSection>
  );
}

export default EconomicBalanceChartCard;
