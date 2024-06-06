import { computeFullTimeJobsImpact } from "./fullTimeJobsImpact";

describe("FullTimeJobs impact", () => {
  it("returns 0 when no current and forecast full time jobs provided", () => {
    expect(
      computeFullTimeJobsImpact({
        current: {
          operationsFullTimeJobs: 0,
        },
        forecast: {
          operationsFullTimeJobs: 0,
          conversionFullTimeJobs: 0,
          reinstatementFullTimeJobs: 0,
        },
        evaluationPeriodInYears: 30,
      }),
    ).toEqual({
      current: 0,
      forecast: 0,
      operations: {
        current: 0,
        forecast: 0,
      },
      conversion: {
        current: 0,
        forecast: 0,
      },
    });
  });

  it("returns impact over 10 years for 0.5 current full-time jobs and forecast 0.3 full-time jobs in operations but no conversion jobs", () => {
    const input = {
      current: {
        operationsFullTimeJobs: 0.5,
      },
      forecast: {
        operationsFullTimeJobs: 0.3,
      },
      evaluationPeriodInYears: 10,
    };
    expect(computeFullTimeJobsImpact(input)).toEqual({
      current: input.current.operationsFullTimeJobs,
      forecast: input.forecast.operationsFullTimeJobs,
      operations: {
        current: input.current.operationsFullTimeJobs,
        forecast: input.forecast.operationsFullTimeJobs,
      },
      conversion: {
        current: 0,
        forecast: 0,
      },
    });
  });

  it("returns impact over 10 years for 0.1 current full-time jobs and forecast 0.3 full-time jobs in operations + 45 full-time jobs for conversion over 9 months", () => {
    const input = {
      current: {
        operationsFullTimeJobs: 0.1,
      },
      forecast: {
        operationsFullTimeJobs: 0.3,
        conversionFullTimeJobs: 45,
        reinstatementFullTimeJobs: 0,
        conversionDurationInYears: 0.75,
      },
      evaluationPeriodInYears: 10,
    };
    expect(computeFullTimeJobsImpact(input)).toEqual({
      current: input.current.operationsFullTimeJobs,
      forecast: 3.675,
      operations: {
        current: input.current.operationsFullTimeJobs,
        forecast: input.forecast.operationsFullTimeJobs,
      },
      conversion: {
        current: 0,
        forecast: 3.375,
      },
    });
  });

  it("returns impact over 20 years for 0.1 current FT jobs and forecast 0.3 FT jobs in operations + 20 FT jobs for conversion over 1 year + 10 FT jobs for reinstatement over 6 months", () => {
    const input = {
      current: {
        operationsFullTimeJobs: 0.1,
      },
      forecast: {
        operationsFullTimeJobs: 0.3,
        conversionFullTimeJobs: 20,
        conversionDurationInYears: 1,
        reinstatementFullTimeJobs: 10,
        reinstatementDurationInYears: 0.5,
      },
      evaluationPeriodInYears: 20,
    };
    expect(computeFullTimeJobsImpact(input)).toEqual({
      current: input.current.operationsFullTimeJobs,
      forecast: 1.55,
      operations: {
        current: input.current.operationsFullTimeJobs,
        forecast: input.forecast.operationsFullTimeJobs,
      },
      conversion: {
        current: 0,
        forecast: 1.25,
      },
    });
  });
});
