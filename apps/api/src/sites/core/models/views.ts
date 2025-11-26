import {
  Address,
  DevelopmentPlanType,
  SiteNature,
  SiteActionType,
  SiteActionStatus,
  SoilType,
  SurfaceAreaDistributionJson,
} from "shared";

export type SiteFeaturesView = {
  id: string;
  name: string;
  nature: SiteNature;
  isExpressSite: boolean;
  owner: {
    name?: string;
    structureType: string;
  };
  tenant?: {
    name?: string;
    structureType?: string;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: SurfaceAreaDistributionJson<SoilType>;
  surfaceArea: number;
  address: Address;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: { amount: number; purpose: string }[];
  yearlyIncomes: { amount: number; source: string }[];
  fricheActivity?: string;
  agriculturalOperationActivity?: string;
  naturalAreaType?: string;
  description?: string;
};

export type SiteView = {
  id: string;
  features: SiteFeaturesView;
  actions: {
    action: SiteActionType;
    status: SiteActionStatus;
  }[];
  reconversionProjects: {
    id: string;
    name: string;
    type: DevelopmentPlanType;
  }[];
};
