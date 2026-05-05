import { useMemo } from "react";
import { sumListWithKey } from "shared";

import {
  HumanityCategory,
  IndirectEconomicImpactsByBearer,
} from "@/features/projects/application/project-impacts/projectBreakEvenLevel.selectors";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localAuthorityIndirectEconomicImpacts: IndirectEconomicImpactsByBearer["humanity"];
};

const CATEGORIES: { label: string; color: string; impacts: HumanityCategory[] }[] = [
  {
    label: "🫀 Économies sur les dépenses de santé",
    impacts: [
      "avoidedAccidentsDeathsExpenses",
      "avoidedAccidentsMinorInjuriesExpenses",
      "avoidedAccidentsSevereInjuriesExpenses",
      "avoidedAirPollutionHealthExpenses",
    ],
    color: "#D0E24B",
  },
  {
    label: "🌿 Valeur de l’action environnementale",
    impacts: [
      "avoidedAirConditioningCo2eqEmissions",
      "avoidedCo2eqWithEnergyProduction",
      "avoidedTrafficCo2EqEmissions",
      "storedCo2Eq",
      "forestRelatedProduct",
      "invasiveSpeciesRegulation",
      "natureRelatedWelnessAndLeisure",
      "nitrogenCycle",
      "pollination",
      "soilErosion",
      "waterCycle",
    ],
    color: "#6CE24B",
  },
];

export default function HumanityIndirectEconomicImpactsCharts({
  localAuthorityIndirectEconomicImpacts,
}: Props) {
  const data = useMemo(() => {
    return CATEGORIES.map(({ label, color, impacts }) => ({
      name: label,
      y: sumListWithKey(
        localAuthorityIndirectEconomicImpacts.details.filter(({ name }) => impacts.includes(name)),
        "amount",
      ),
      color,
    })).filter(({ y }) => y !== 0);
  }, [localAuthorityIndirectEconomicImpacts]);

  return (
    <EconomicColumnChart
      title="🌍️ Impacts économiques pour la société française et mondiale"
      legendText="Impact total pour la société"
      legendTotal={localAuthorityIndirectEconomicImpacts.total}
      data={data}
    />
  );
}
