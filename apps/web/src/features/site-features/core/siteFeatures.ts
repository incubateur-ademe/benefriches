import {
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  SoilsDistribution,
} from "shared";

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
  incomes: { amount: number; source: SiteYearlyIncome["source"] }[];
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSurfaceArea?: number;
  name: string;
  description?: string;
  fricheActivity?: FricheActivity;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  naturalAreaType?: NaturalAreaType;
};
