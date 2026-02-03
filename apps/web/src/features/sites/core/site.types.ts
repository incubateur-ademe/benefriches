import {
  AgriculturalOperationActivity,
  DevelopmentPlanType,
  FricheActivity,
  MutabilityUsage,
  NaturalAreaType,
  SiteActionStatus,
  SiteActionType,
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
    severeInjuries?: number;
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

export type SiteView = {
  id: string;
  features: SiteFeatures;
  actions: {
    action: SiteActionType;
    status: SiteActionStatus;
  }[];
  reconversionProjects: {
    id: string;
    name: string;
    type: DevelopmentPlanType;
  }[];
  compatibilityEvaluation: {
    results: { usage: MutabilityUsage; score: number }[];
    reliabilityScore: number;
  } | null;
};
