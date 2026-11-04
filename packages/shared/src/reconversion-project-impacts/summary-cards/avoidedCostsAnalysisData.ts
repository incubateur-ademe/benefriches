import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { typedObjectEntries } from "../../object-entries";
import { sumListWithKey } from "../../services";
import { groupIndirectEconomicImpactsByBearerAndCategory } from "../group-impacts/groupIndirectEconomicImpactsByBearerAndCategory";

export type AvoidedCostsAnalysisData = {
  localAuthorityMainIndirectEconomicImpact:
    | {
        name:
          | "rentalIncome"
          | "taxesIncome"
          | "operatingEconomicBalance"
          | "fricheCosts"
          | "municipalityExpenses";
        total: number;
      }
    | undefined;
  indirectEconomicImpactsTotal: number;
};

export const getAvoidedCostsAnalysisData = (
  impacts: GetReconversionProjectImpactsResultDto["impacts"],
): AvoidedCostsAnalysisData => {
  const { localAuthority } = groupIndirectEconomicImpactsByBearerAndCategory({
    indirectEconomicImpactsTotal:
      impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
    indirectEconomicImpacts: impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
    stakeholders: impacts.stakeholders,
  });

  const { total: _, ...localAuthorityImpacts } = localAuthority;

  const sortedImpacts = typedObjectEntries(localAuthorityImpacts)
    .map(([category, value = []]) => ({ name: category, total: sumListWithKey(value, "total") }))
    .filter(({ total }) => total !== 0)
    .toSorted((a, b) => Math.abs(b.total) - Math.abs(a.total));

  return {
    localAuthorityMainIndirectEconomicImpact: sortedImpacts[0],
    indirectEconomicImpactsTotal:
      impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
  };
};
