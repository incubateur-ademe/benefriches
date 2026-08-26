import { useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";
import { Link } from "type-route";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";

import { HUMANITY_IMPACTS_CATEGORIES } from "../../shared/impacts/impactGroupCategory";
import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  humanityIndirectEconomicImpacts: IndirectEconomicImpactsByBearerAndGroupCategory["humanity"];
  linkProps?: Link;
};

export default function HumanityIndirectEconomicImpactsCharts({
  humanityIndirectEconomicImpacts,
  linkProps,
}: Props) {
  const { total, ...impacts } = humanityIndirectEconomicImpacts;

  const data = useMemo(() => {
    return typedObjectEntries(impacts).map(([category, items = []]) => ({
      name: HUMANITY_IMPACTS_CATEGORIES[category].label,
      y: sumListWithKey(items, "total"),
      color: HUMANITY_IMPACTS_CATEGORIES[category].color,
    }));
  }, [impacts]);

  return (
    <EconomicColumnChart
      linkProps={linkProps}
      title="🌍️ Impacts économiques pour la société française et mondiale"
      legendText="Impact total pour la société"
      legendTotal={total}
      data={data}
    />
  );
}
