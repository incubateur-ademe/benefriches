import { FricheActivity, SiteYearlyExpensePurpose, SoilsDistribution } from "shared";

export type SiteFeatures = {
  id: string;
  isExpressSite: boolean;
  address: string;
  ownerName: string;
  tenantName?: string;
  fullTimeJobsInvolved?: number;
  accidents?: {
    minorInjuries?: number;
    severyInjuries?: number;
    accidentsDeaths?: number;
  };
  expenses: { amount: number; purpose: SiteYearlyExpensePurpose }[];
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSurfaceArea?: number;
  fricheActivity?: FricheActivity;
  name: string;
  description?: string;
  isFriche: boolean;
};
