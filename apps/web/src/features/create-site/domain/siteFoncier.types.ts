import { FricheActivity } from "./friche.types";

import { SoilType } from "@/shared/domain/soils";
import { OwnerStructureType, TenantStructureType } from "@/shared/domain/stakeholder";

export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type Address = {
  banId: string;
  value: string;
  city: string;
  cityCode: string;
  postCode: string;
  streetNumber?: string;
  streetName?: string;
  long: number;
  lat: number;
};

export type SoilsSurfaceAreaDistribution = Partial<Record<SoilType, number>>;

export type SiteDraft = {
  id: string;
  isFriche: boolean;
  name: string;
  description?: string;
  address: Address;
  // soils
  surfaceArea: number;
  soils: SoilType[];
  soilsDistributionEntryMode: "default_even_split" | "total_surface_percentage" | "square_meters";
  soilsDistribution: SoilsSurfaceAreaDistribution;
  // contamination
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  fricheActivity?: FricheActivity;
  // management
  fullTimeJobsInvolved?: number;
  owner: { structureType: OwnerStructureType; name: string };
  tenant?: { structureType: TenantStructureType; name: string };
  hasRecentAccidents?: boolean;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: Expense[];
  yearlyIncomes: Income[];
};

export type Tenant = { structureType: TenantStructureType; name: string };
export type Owner = { structureType: OwnerStructureType; name: string };

export type ExpensePurpose =
  | "rent"
  | "propertyTaxes"
  | "otherTaxes"
  | "maintenance"
  | "otherManagementCosts"
  | "security"
  | "illegalDumpingCost"
  | "accidentsCost"
  | "otherSecuringCosts";

type ExpensePurposeCategory =
  | "rent"
  | "safety"
  | "site_management"
  | "soils_degradation"
  | "taxes"
  | "other";

export type Expense = {
  purpose: ExpensePurpose;
  purposeCategory: ExpensePurposeCategory;
  bearer: "owner" | "tenant" | "local_or_regional_authority" | "society";
  amount: number;
};

export type Income = {
  source: string;
  amount: number;
};
