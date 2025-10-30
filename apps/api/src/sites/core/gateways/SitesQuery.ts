import { Address, SiteNature, SoilType } from "shared";

export type SiteViewModel = {
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
  soilsDistribution: Partial<Record<SoilType, number>>;
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

export interface SitesQuery {
  getById(siteId: SiteViewModel["id"]): Promise<SiteViewModel | undefined>;
}
