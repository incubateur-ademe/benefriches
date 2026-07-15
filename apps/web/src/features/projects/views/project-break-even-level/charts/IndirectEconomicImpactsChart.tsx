import { useMemo } from "react";
import { typedObjectEntries } from "shared";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  indirectEconomicImpactsTotalByBearer: {
    localAuthority: number;
    localPeopleOrCompany: number;
    humanity: number;
  };
  indirectEconomicImpactsTotal: number;
};

const getLabelForBearer = (name: keyof Props["indirectEconomicImpactsTotalByBearer"]) => {
  switch (name) {
    case "localAuthority":
      return "Collectivité";
    case "localPeopleOrCompany":
      return "Riverains";
    case "humanity":
      return "Société française et mondiale";
  }
};

const getColorForBearer = (name: keyof Props["indirectEconomicImpactsTotalByBearer"]) => {
  switch (name) {
    case "localAuthority":
      return "#1D5DA2";
    case "localPeopleOrCompany":
      return "#FD7CC5";
    case "humanity":
      return "#9EE24B";
  }
};

export default function IndirectEconomicImpactsChart({
  indirectEconomicImpactsTotalByBearer,
  indirectEconomicImpactsTotal,
}: Props) {
  const data = useMemo(() => {
    return typedObjectEntries(indirectEconomicImpactsTotalByBearer)
      .map(([bearer, total]) => ({
        name: getLabelForBearer(bearer),
        y: total,
        color: getColorForBearer(bearer),
      }))
      .filter(({ y }) => y !== 0);
  }, [indirectEconomicImpactsTotalByBearer]);

  return (
    <EconomicColumnChart
      title="👥 Impacts socio-économiques"
      legendText="Montant total des impacts"
      legendTotal={indirectEconomicImpactsTotal}
      data={data}
    />
  );
}
