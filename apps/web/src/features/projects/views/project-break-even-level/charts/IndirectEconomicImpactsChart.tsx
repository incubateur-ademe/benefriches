import { useMemo } from "react";
import { typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearer } from "@/features/projects/application/project-impacts/projectBreakEvenLevel.selectors";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearer;
  indirectEconomicImpactsTotal: number;
};

const getLabelForBearer = (name: keyof IndirectEconomicImpactsByBearer) => {
  switch (name) {
    case "local_authority":
      return "Collectivité";
    case "local_people_or_company":
      return "Riverains";
    case "humanity":
      return "Société française et mondiale";
  }
};

const getColorForBearer = (name: keyof IndirectEconomicImpactsByBearer) => {
  switch (name) {
    case "local_authority":
      return "#1D5DA2";
    case "local_people_or_company":
      return "#FD7CC5";
    case "humanity":
      return "#9EE24B";
  }
};

export default function IndirectEconomicImpactsChart({
  indirectEconomicImpactsByBearer,
  indirectEconomicImpactsTotal,
}: Props) {
  const data = useMemo(() => {
    return typedObjectEntries(indirectEconomicImpactsByBearer)
      .map(([bearer, { total }]) => ({
        name: getLabelForBearer(bearer),
        y: total,
        color: getColorForBearer(bearer),
      }))
      .filter(({ y }) => y !== 0);
  }, [indirectEconomicImpactsByBearer]);

  return (
    <EconomicColumnChart
      title="👥 Impacts socio-économiques"
      legendText="Montant total des impacts"
      legendTotal={indirectEconomicImpactsTotal}
      data={data}
    />
  );
}
