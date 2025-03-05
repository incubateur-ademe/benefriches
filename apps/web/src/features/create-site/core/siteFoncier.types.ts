import {
  Address,
  FricheActivity,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
  SoilType,
} from "shared";

import { OwnerStructureType, TenantStructureType } from "@/shared/core/stakeholder";

export type SurfaceAreaDistributionEntryMode =
  | "default_even_split"
  | "total_surface_percentage"
  | "square_meters";

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
  fricheActivity?: FricheActivity;
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
};

export type SiteExpressCreationData = {
  id: string;
  isFriche: boolean;
  nature: SiteNature;
  address: Address;
  surfaceArea: number;
};

export type Tenant = { structureType: TenantStructureType; name: string };
export type Owner = { structureType: OwnerStructureType; name: string };
