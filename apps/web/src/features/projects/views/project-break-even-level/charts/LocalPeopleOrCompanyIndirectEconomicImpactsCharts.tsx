import { useId, useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localPeopleOrCompanyIndirectEconomicImpacts: IndirectEconomicImpactsByBearerAndGroupCategory["localPeopleOrCompany"];
};

type LocalPeopleOrCompanyImpactCategory = Exclude<
  keyof Props["localPeopleOrCompanyIndirectEconomicImpacts"],
  "total"
>;
const CATEGORIES: Record<LocalPeopleOrCompanyImpactCategory, { label: string; color: string }> = {
  fricheCosts: {
    label: "🏚️ Économies réalisées grâce à la suppression de la friche",
    color: "#25CB7B",
  },
  purchasingPowerIncrease: {
    label: "👛 Pouvoir d’achat des riverains",
    color: "#F57CFD",
  },
  operatingEconomicBalance: {
    label: "💰‍️ Bénéfices d'exploitation",
    color: "#1BBB36",
  },
  rentalIncome: {
    label: "🔑 Revenus locatifs",
    color: "#B4D21E",
  },
  localPropertyValueIncrease: {
    label: "🏡 Valeur patrimoniale autour de la friche",
    color: "#FD7C85",
  },
};

export default function LocalPeopleOrCompanyIndirectEconomicImpactsCharts({
  localPeopleOrCompanyIndirectEconomicImpacts,
}: Props) {
  const { total, ...impacts } = localPeopleOrCompanyIndirectEconomicImpacts;

  const data = useMemo(() => {
    return typedObjectEntries(impacts).map(([category, items = []]) => ({
      name: CATEGORIES[category].label,
      y: sumListWithKey(items, "total"),
      color: CATEGORIES[category].color,
    }));
  }, [impacts]);

  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <EconomicColumnChart
      legendText="Impact total pour les riverains"
      legendTotal={total}
      data={data}
      title="🏘️ Impacts économiques pour les riverains"
    />
  );
}
