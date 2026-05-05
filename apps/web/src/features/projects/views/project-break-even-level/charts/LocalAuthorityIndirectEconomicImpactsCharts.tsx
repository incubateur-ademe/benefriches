import { useMemo } from "react";
import { sumListWithKey } from "shared";

import {
  IndirectEconomicImpactsByBearer,
  LocalAuthorityCategory,
} from "@/features/projects/application/project-impacts/projectBreakEvenLevel.selectors";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localAuthorityIndirectEconomicImpacts: IndirectEconomicImpactsByBearer["local_authority"];
};

const CATEGORIES: { label: string; color: string; impacts: LocalAuthorityCategory[] }[] = [
  {
    label: "🏚️ Économies réalisées grâce à la suppression de la friche",
    impacts: [
      "avoidedFricheMaintenanceAndSecuringCostsForOwner",
      "avoidedFricheMaintenanceAndSecuringCostsForTenant",
    ],
    color: "#25CB7B",
  },
  {
    label: "🏛️ Recettes fiscales",
    impacts: [
      "localTransferDutiesIncrease",
      "projectNewCompanyTaxationIncome",
      "projectNewHousesTaxesIncome",
      "projectPhotovoltaicTaxesIncome",
      "propertyTransferDutiesIncome",
    ],
    color: "#1D5DA2",
  },
  {
    label: "💰‍️ Bénéfices d'exploitation",
    impacts: ["previousSiteOperationBenefitLoss", "projectOperatingEconomicBalance"],
    color: "#1BBB36",
  },
  {
    label: "🔑 Revenus locatifs communaux",
    impacts: ["oldRentalIncomeLoss", "projectedRentalIncome", "projectedRentalIncomeIncrease"],
    color: "#B4D21E",
  },
  {
    label: "🚰  Dépenses communales évitées",
    impacts: ["waterRegulation"],
    color: "#6145DE",
  },
];

export default function LocalAuthorityIndirectEconomicImpactsCharts({
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
      legendText="Impact total pour la collectivité locale"
      legendTotal={localAuthorityIndirectEconomicImpacts.total}
      data={data}
      title="🏛️ Impacts économiques pour la collectivité locale"
    />
  );
}
