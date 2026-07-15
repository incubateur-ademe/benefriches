import { useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  humanityIndirectEconomicImpacts: IndirectEconomicImpactsByBearerAndGroupCategory["humanity"];
};

type HumanityImpactCategory = Exclude<keyof Props["humanityIndirectEconomicImpacts"], "total">;

const CATEGORIES: Record<HumanityImpactCategory, { label: string; color: string }> = {
  avoidedHealthExpenses: {
    label: "🫀 Économies sur les dépenses de santé",
    color: "#D0E24B",
  },
  environmentalAction: {
    label: "🌿 Valeur de l’action environnementale",
    color: "#6CE24B",
  },
};

export default function HumanityIndirectEconomicImpactsCharts({
  humanityIndirectEconomicImpacts,
}: Props) {
  const { total, ...impacts } = humanityIndirectEconomicImpacts;

  const data = useMemo(() => {
    return typedObjectEntries(impacts).map(([category, items = []]) => ({
      name: CATEGORIES[category].label,
      y: sumListWithKey(items, "total"),
      color: CATEGORIES[category].color,
    }));
  }, [impacts]);

  return (
    <EconomicColumnChart
      title="🌍️ Impacts économiques pour la société française et mondiale"
      legendText="Impact total pour la société"
      legendTotal={total}
      data={data}
    />
  );
}
