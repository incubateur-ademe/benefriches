import { useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localAuthorityIndirectEconomicImpacts: IndirectEconomicImpactsByBearerAndGroupCategory["localAuthority"];
};

type LocalAuthorityImpactCategory = Exclude<
  keyof Props["localAuthorityIndirectEconomicImpacts"],
  "total"
>;
const CATEGORIES: Record<LocalAuthorityImpactCategory, { label: string; color: string }> = {
  fricheCosts: {
    label: "🏚️ Économies réalisées grâce à la suppression de la friche",
    color: "#25CB7B",
  },
  taxesIncome: {
    label: "🏛️ Recettes fiscales",
    color: "#1D5DA2",
  },
  operatingEconomicBalance: {
    label: "💰‍️ Bénéfices d'exploitation",
    color: "#1BBB36",
  },
  rentalIncome: {
    label: "🔑 Revenus locatifs communaux",
    color: "#B4D21E",
  },
  municipalityExpenses: {
    label: "👷 Dépenses communales",
    color: "#6145DE",
  },
};

export default function LocalAuthorityIndirectEconomicImpactsCharts({
  localAuthorityIndirectEconomicImpacts,
}: Props) {
  const { total, ...impacts } = localAuthorityIndirectEconomicImpacts;

  const data = useMemo(() => {
    return typedObjectEntries(impacts).map(([category, items = []]) => ({
      name: CATEGORIES[category].label,
      y: sumListWithKey(items, "total"),
      color: CATEGORIES[category].color,
    }));
  }, [impacts]);

  return (
    <EconomicColumnChart
      legendText="Impact total pour la collectivité locale"
      legendTotal={total}
      data={data}
      title="🏛️ Impacts économiques pour la collectivité locale"
    />
  );
}
