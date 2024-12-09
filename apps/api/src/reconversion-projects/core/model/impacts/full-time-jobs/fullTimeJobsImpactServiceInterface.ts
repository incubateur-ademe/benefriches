import { FullTimeJobsImpactResult } from "shared";

export interface FullTimeJobsImpactServiceInterface {
  getFullTimeJobsImpacts: () => FullTimeJobsImpactResult;
}
