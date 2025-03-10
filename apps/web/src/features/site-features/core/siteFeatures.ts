import { FricheActivity, SiteNature, SiteYearlyExpensePurpose, SoilsDistribution } from "shared";

export type SiteFeatures = {
  id: string;
  nature: SiteNature;
  isExpressSite: boolean;
  address: string;
  ownerName: string;
  tenantName?: string;
  accidents: {
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
};
