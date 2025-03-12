import {
  Address,
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
  SoilType,
} from "shared";

import { OwnerStructureType, TenantStructureType } from "@/shared/core/stakeholder";

export type SurfaceAreaDistributionEntryMode = "default_even_split" | "square_meters_or_percentage";

export type SiteCreationData = {
  id: string;
  isFriche?: boolean;
  nature?: SiteNature;
  name?: string;
  description?: string;
  address?: Address;
  // soils
  surfaceArea?: number;
  soils: SoilType[];
  soilsDistributionEntryMode?: SurfaceAreaDistributionEntryMode;
  soilsDistribution?: SoilsDistribution;
  // contamination
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  // management
  owner?: { structureType: OwnerStructureType; name: string };
  isFricheLeased?: boolean;
  isSiteOperated?: boolean;
  tenant?: { structureType: TenantStructureType; name: string };
  hasRecentAccidents?: boolean;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
  // activity
  fricheActivity?: FricheActivity;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  naturalAreaType?: NaturalAreaType;
};

export type SiteExpressCreationData = {
  id: string;
  isFriche: boolean;
  nature: SiteNature;
  address: Address;
  surfaceArea: number;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  naturalAreaType?: NaturalAreaType;
};

export type Tenant = { structureType: TenantStructureType; name: string };
export type Owner = { structureType: OwnerStructureType; name: string };
