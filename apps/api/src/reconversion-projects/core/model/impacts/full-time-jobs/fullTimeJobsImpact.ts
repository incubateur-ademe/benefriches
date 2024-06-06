export type FullTimeJobsImpactResult = {
  current: number;
  forecast: number;
  operations: {
    current: number;
    forecast: number;
  };
  conversion: {
    current: number;
    forecast: number;
  };
};

type FullTimeJobsImpactInput = {
  current: {
    operationsFullTimeJobs?: number;
  };
  forecast: {
    operationsFullTimeJobs?: number;
    conversionFullTimeJobs?: number;
    conversionDurationInYears?: number;
    reinstatementFullTimeJobs?: number;
    reinstatementDurationInYears?: number;
  };
  evaluationPeriodInYears: number;
};

type SpreadTemporaryFullTimeJobsOverInput = {
  temporaryFullTimeJobs: number;
  currentDurationInYears: number;
  targetDurationInYears: number;
};

const spreadTemporaryFullTimeJobsOver = (input: SpreadTemporaryFullTimeJobsOverInput) => {
  return (input.temporaryFullTimeJobs * input.currentDurationInYears) / input.targetDurationInYears;
};

export const computeFullTimeJobsImpact = ({
  current,
  forecast,
  evaluationPeriodInYears,
}: FullTimeJobsImpactInput): FullTimeJobsImpactResult => {
  const conversionJobsSpreadOverEvaluationPeriod =
    forecast.conversionDurationInYears && forecast.conversionFullTimeJobs
      ? spreadTemporaryFullTimeJobsOver({
          targetDurationInYears: evaluationPeriodInYears,
          currentDurationInYears: forecast.conversionDurationInYears,
          temporaryFullTimeJobs: forecast.conversionFullTimeJobs,
        })
      : 0;
  const reinstatementJobsSpreadOverEvaluationPeriod =
    forecast.reinstatementDurationInYears && forecast.reinstatementFullTimeJobs
      ? spreadTemporaryFullTimeJobsOver({
          targetDurationInYears: evaluationPeriodInYears,
          currentDurationInYears: forecast.reinstatementDurationInYears,
          temporaryFullTimeJobs: forecast.reinstatementFullTimeJobs,
        })
      : 0;
  const totalCurrentFullTimeJobs = current.operationsFullTimeJobs ?? 0;
  const totalForecastFullTimeJobs =
    (forecast.operationsFullTimeJobs ?? 0) +
    conversionJobsSpreadOverEvaluationPeriod +
    reinstatementJobsSpreadOverEvaluationPeriod;

  return {
    current: totalCurrentFullTimeJobs,
    forecast: totalForecastFullTimeJobs,
    operations: {
      current: current.operationsFullTimeJobs ?? 0,
      forecast: forecast.operationsFullTimeJobs ?? 0,
    },
    conversion: {
      current: 0,
      forecast:
        conversionJobsSpreadOverEvaluationPeriod + reinstatementJobsSpreadOverEvaluationPeriod,
    },
  };
};
