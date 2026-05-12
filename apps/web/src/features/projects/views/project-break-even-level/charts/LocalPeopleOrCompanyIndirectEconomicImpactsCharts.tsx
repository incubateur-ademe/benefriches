import { useId, useMemo } from "react";
import { sumListWithKey } from "shared";

import {
  IndirectEconomicImpactsByBearer,
  LocalPeopleOrCompanyCategory,
} from "@/features/projects/application/project-impacts/projectBreakEvenLevel.selectors";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

import EconomicColumnChart from "./EconomicColumnChart";

type Props = {
  localAuthorityIndirectEconomicImpacts: IndirectEconomicImpactsByBearer["local_people_or_company"];
};

const CATEGORIES: { label: string; color: string; impacts: LocalPeopleOrCompanyCategory[] }[] = [
  {
    label: "🏚️ Économies réalisées grâce à la suppression de la friche",
    impacts: [
      "avoidedFricheMaintenanceAndSecuringCostsForOwner",
      "avoidedFricheMaintenanceAndSecuringCostsForTenant",
    ],
    color: "#25CB7B",
  },
  {
    label: "👛 Pouvoir d’achat des riverains",
    impacts: [
      "travelTimeSavedPerTravelerExpenses",
      "avoidedCarRelatedExpenses",
      "avoidedPropertyDamageExpenses",
      "avoidedAirConditioningExpenses",
    ],
    color: "#F57CFD",
  },
  {
    label: "💰‍️ Bénéfices d'exploitation",
    impacts: ["previousSiteOperationBenefitLoss", "projectOperatingEconomicBalance"],
    color: "#1BBB36",
  },
  {
    label: "🔑 Revenus locatifs",
    impacts: ["oldRentalIncomeLoss", "projectedRentalIncome", "projectedRentalIncomeIncrease"],
    color: "#B4D21E",
  },
  {
    label: "🏡 Valeur patrimoniale autour de la friche",
    impacts: ["localPropertyValueIncrease"],
    color: "#FD7C85",
  },
];

export default function LocalPeopleOrCompanyIndirectEconomicImpactsCharts({
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

  const chartContainerId = useId();

  const colors = data.map(({ color }) => color);

  useChartCustomPointColors(chartContainerId, colors);

  return (
    <EconomicColumnChart
      legendText="Impact total pour les riverains"
      legendTotal={localAuthorityIndirectEconomicImpacts.total}
      data={data}
      title="🏘️ Impacts économiques pour les riverains"
    />
  );
}
