import type {
  AgriculturalOperationActivity,
  DevelopmentPlanType,
  FricheActivity,
  MutabilityUsage,
  NaturalAreaType,
  SiteActionStatus,
  SiteActionType,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  SoilsDistribution,
} from "shared";

type BaseSiteFeatures = {
  id: string;
  isExpressSite: boolean;
  address: string;
  ownerName: string;
  tenantName?: string;
  expenses: { amount: number; purpose: SiteYearlyExpensePurpose }[];
  incomes: { amount: number; source: SiteYearlyIncome["source"] }[];
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  name: string;
  description?: string;
};

type FricheSiteFeatures = BaseSiteFeatures & {
  nature: "FRICHE";
  contaminatedSurfaceArea?: number;
  accidents: {
    minorInjuries?: number;
    severeInjuries?: number;
    accidentsDeaths?: number;
  };
  fricheActivity?: FricheActivity;
};

type AgriculturalOperationSiteFeatures = BaseSiteFeatures & {
  nature: "AGRICULTURAL_OPERATION";
  agriculturalOperationActivity: AgriculturalOperationActivity;
};

type NaturalAreaSiteFeatures = BaseSiteFeatures & {
  nature: "NATURAL_AREA";
  naturalAreaType: NaturalAreaType;
};

type UrbanZoneSiteFeatures = BaseSiteFeatures & {
  nature: "URBAN_ZONE";
  contaminatedSurfaceArea?: number;
};

export type SiteFeatures =
  | FricheSiteFeatures
  | AgriculturalOperationSiteFeatures
  | NaturalAreaSiteFeatures
  | UrbanZoneSiteFeatures;

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
    express: boolean;
  }[];
  compatibilityEvaluation: {
    results: { usage: MutabilityUsage; score: number }[];
    reliabilityScore: number;
  } | null;
};
