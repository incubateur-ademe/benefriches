import { useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";

import { LOCAL_AUTHORITY_IMPACTS_CATEGORIES } from "../../shared/impacts/impactGroupCategory";
import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localAuthorityIndirectEconomicImpacts: IndirectEconomicImpactsByBearerAndGroupCategory["localAuthority"];
  dialogId?: string;
};

export default function LocalAuthorityIndirectEconomicImpactsCharts({
  localAuthorityIndirectEconomicImpacts,
  dialogId,
}: Props) {
  const { total, ...impacts } = localAuthorityIndirectEconomicImpacts;

  const data = useMemo(() => {
    return typedObjectEntries(impacts).map(([category, items = []]) => ({
      name: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
      y: sumListWithKey(items, "total"),
      color: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].color,
    }));
  }, [impacts]);

  return (
    <EconomicColumnChart
      dialogId={dialogId}
      legendText="Impact total pour la collectivité locale"
      legendTotal={total}
      data={data}
      title="🏛️ Impacts économiques pour la collectivité locale"
    />
  );
}
