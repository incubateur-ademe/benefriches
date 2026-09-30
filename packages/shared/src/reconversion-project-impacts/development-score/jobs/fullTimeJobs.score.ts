import type { GetReconversionProjectImpactsResultDto } from "../../../api-dtos";
import { roundTo2Digits } from "../../../services";
import { convertSquareMetersToHectares } from "../../../surface-area";
import type { AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { type ScoredMetrics, sumMetricsTotalByName } from "../scoring.helpers";

const getJobsLetterGrade = (fullTimeJobsDifferenceByHectare: number) => {
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
}): ScoredMetrics<{
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
    letterGrade: getJobsLetterGrade(fullTimeJobsDifferenceByHectare),
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
