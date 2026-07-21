import { useId, useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

import { LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES } from "../../shared/impacts/impactGroupCategory";
import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localPeopleOrCompanyIndirectEconomicImpacts: IndirectEconomicImpactsByBearerAndGroupCategory["localPeopleOrCompany"];
};

export default function LocalPeopleOrCompanyIndirectEconomicImpactsCharts({
  localPeopleOrCompanyIndirectEconomicImpacts,
}: Props) {
  const { total, ...impacts } = localPeopleOrCompanyIndirectEconomicImpacts;

  const data = useMemo(() => {
    return typedObjectEntries(impacts).map(([category, items = []]) => ({
      name: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].label,
      y: sumListWithKey(items, "total"),
      color: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].color,
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
