import { SoilsDistribution } from "../soils";
import { FricheActivity } from "./fricheActivity";
import { SiteYearlyExpense } from "./yearlyExpenses";
import { SiteYearlyIncome } from "./yearlyIncome";

interface BaseSite {
  id: string;
  isFriche: boolean;
  address: {
    city: string;
    cityCode: string;
    label: string;
  };
  soilsDistribution: SoilsDistribution;
  owner: {
    structureType: string;
    name: string;
  };
  tenant?: {
    structureType: string;
    name: string;
  };
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
  name: string;
  description?: string;
  surfaceArea: number;
}

export interface Friche extends BaseSite {
  isFriche: true;
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  fricheActivity: FricheActivity;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
}

export interface NonFriche extends BaseSite {
  isFriche: false;
}

export type Site = Friche | NonFriche;
