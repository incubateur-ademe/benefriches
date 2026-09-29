import type { GetReconversionProjectImpactsResultDto } from "../../../api-dtos";
import { roundTo2Digits } from "../../../services";
import { convertSquareMetersToHectares } from "../../../surface-area";
import type { AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { type ItemScoreResult, sumMetricsTotalByName } from "../scoring.helpers";

const getJobsLetterScore = (fullTimeJobsDifferenceByHectare: number) => {
  if (fullTimeJobsDifferenceByHectare > 50) {
    return "A";
  }
  if (fullTimeJobsDifferenceByHectare > 0.15) {
    return "B";
  }
  if (fullTimeJobsDifferenceByHectare >= 0) {
    return "C";
  }
  return "D";
};

export const getFullTimeJobsScore = (props: {
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
  siteSurfaceArea: GetReconversionProjectImpactsResultDto["contextData"]["siteSurfaceArea"];
}): ItemScoreResult<{
  fullTimeJobsDifferenceByHectare: number;
  siteStatuQuoFullTimeJobs: number;
  difference: number;
}> => {
  const fullTimeJobsDifference = sumMetricsTotalByName(
    props.aggregatedReconversionImpactMetrics,
    "conversionFullTimeJobs",
    "operationsFullTimeJobs",
    "oldOperationsFullTimeJobsLoss",
    "reinstatementFullTimeJobs",
  );

  const siteSurfaceAreaHectare = convertSquareMetersToHectares(props.siteSurfaceArea);

  const fullTimeJobsDifferenceByHectare = roundTo2Digits(
    fullTimeJobsDifference / siteSurfaceAreaHectare,
  );

  const oldOperationsFullTimeJobsLoss =
    props.aggregatedReconversionImpactMetrics.find(
      ({ name }) => name === "oldOperationsFullTimeJobsLoss",
    )?.total ?? 0;

  return {
    letterScore: getJobsLetterScore(fullTimeJobsDifferenceByHectare),
    metrics: {
      fullTimeJobsDifferenceByHectare,
      siteStatuQuoFullTimeJobs:
        oldOperationsFullTimeJobsLoss === 0
          ? oldOperationsFullTimeJobsLoss
          : -1 * oldOperationsFullTimeJobsLoss,
      difference: fullTimeJobsDifference,
    },
  };
};
