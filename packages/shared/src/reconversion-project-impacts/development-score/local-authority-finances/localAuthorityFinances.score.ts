import type { GetReconversionProjectImpactsResultDto } from "../../../api-dtos";
import { roundToInteger } from "../../../services";
import { groupIndirectEconomicImpactsByBearer } from "../../group-impacts";
import type { AggregatedReconversionIndirectEconomicImpactsDataView } from "../../projectImpacts.types";
import type { ItemScoreResult } from "../scoring.helpers";

const getLetterScore = (percentage: number) => {
  if (percentage > 150) {
    return "A";
  }
  if (percentage > 15) {
    return "B";
  }
  if (percentage > -7) {
    return "C";
  }
  if (percentage > -50) {
    return "D";
  }

  return "E";
};

export const getLocalAuthorityFinancesScore = (props: {
  aggregatedReconversionEconomicImpacts: AggregatedReconversionIndirectEconomicImpactsDataView["details"];
  stakeholders: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"];
  municipalityYearlyCapitalExpenditures: number;
}): ItemScoreResult<{
  localAuthorityTotal: number;
  percentage: number;
  municipalityYearlyCapitalExpenditures: number;
}> => {
  const impactsByBearer = groupIndirectEconomicImpactsByBearer(
    props.aggregatedReconversionEconomicImpacts,
    props.stakeholders,
  );

  const localAuthorityTotal = impactsByBearer.localAuthority.total;

  const percentage = roundToInteger(
    (localAuthorityTotal * 100) / props.municipalityYearlyCapitalExpenditures,
  );

  return {
    letterScore: getLetterScore(percentage),
    metrics: {
      localAuthorityTotal,
      percentage,
      municipalityYearlyCapitalExpenditures: props.municipalityYearlyCapitalExpenditures,
    },
  };
};
