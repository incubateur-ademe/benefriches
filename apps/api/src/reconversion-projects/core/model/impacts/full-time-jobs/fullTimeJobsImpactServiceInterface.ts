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

export interface FullTimeJobsImpactServiceInterface {
  getFullTimeJobsImpacts: () => FullTimeJobsImpactResult;
}
