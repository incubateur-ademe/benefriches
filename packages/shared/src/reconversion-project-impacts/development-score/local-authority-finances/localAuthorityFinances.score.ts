import type { GetReconversionProjectImpactsResultDto } from "../../../api-dtos";
import { roundToInteger } from "../../../services";
import { groupIndirectEconomicImpactsByBearer } from "../../group-impacts";
import type { AggregatedReconversionIndirectEconomicImpactsDataView } from "../../projectImpacts.types";
import type {
  LocalAuthorityFinancesIndicatorMetrics,
  LetterGrade,
} from "../developmentScore.types";
import type { RequiredIndicatorScore } from "../scoring.helpers";

const getLetterGrade = (percentage: number): LetterGrade => {
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
  municipalityCapitalExpenditures: { amount: number; referenceYear: string };
}): RequiredIndicatorScore<LocalAuthorityFinancesIndicatorMetrics> => {
  const impactsByBearer = groupIndirectEconomicImpactsByBearer(
    props.aggregatedReconversionEconomicImpacts,
    props.stakeholders,
  );

  const localAuthorityTotal = impactsByBearer.localAuthority.total;

  const percentage = roundToInteger(
    (localAuthorityTotal * 100) / props.municipalityCapitalExpenditures.amount,
  );

  return {
    letterGrade: getLetterGrade(percentage),
    metrics: {
      projectLocalAuthorityIndirectEconomicImpactsTotal: localAuthorityTotal,
      percentageComparison: percentage,
      municipalityCapitalExpendituresReferenceYear:
        props.municipalityCapitalExpenditures.referenceYear,
      municipalityCapitalExpendituresAmount: props.municipalityCapitalExpenditures.amount,
    },
  };
};
