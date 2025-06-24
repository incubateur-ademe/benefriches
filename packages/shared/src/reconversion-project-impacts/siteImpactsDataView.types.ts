import {
  Address,
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
} from "../site";
import { SoilsDistribution } from "../soils";

export type SiteImpactsDataView = {
  id: string;
  description?: string;
  name: string;
  nature: SiteNature;
  isExpressSite: boolean;
  fricheActivity?: FricheActivity;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  naturalAreaType?: NaturalAreaType;
  isSiteOperated?: boolean;
  address: Address;
  contaminatedSoilSurface?: number;
  ownerStructureType: string;
  ownerName: string;
  tenantName?: string;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  accidentsDeaths?: number;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
};
