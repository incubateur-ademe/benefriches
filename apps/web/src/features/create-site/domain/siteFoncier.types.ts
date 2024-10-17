import { FricheActivity, SiteYearlyExpensePurpose, SoilsDistribution, SoilType } from "shared";

import { OwnerStructureType, TenantStructureType } from "@/shared/domain/stakeholder";

export type Address = StreetAddress | HouseNumberAddress | MunicipalityAddress | BaseAddress;

type BaseAddress = {
  banId: string;
  value: string;
  city: string;
  cityCode: string;
  postCode: string;
  long: number;
  lat: number;
};
type StreetAddress = BaseAddress & {
  streetName: string;
};

type HouseNumberAddress = StreetAddress & {
  streetNumber: string;
};

export type MunicipalityAddress = BaseAddress & {
  population: number;
  municipality: string;
};

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
  soilsDistribution: SoilsDistribution;
  // contamination
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  fricheActivity?: FricheActivity;
  // management
  owner: { structureType: OwnerStructureType; name: string };
  isFricheLeased?: boolean;
  isSiteOperated?: boolean;
  tenant?: { structureType: TenantStructureType; name: string };
  hasRecentAccidents?: boolean;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: Expense[];
  yearlyIncomes: Income[];
};

export type SiteExpressDraft = {
  id: string;
  isFriche: boolean;
  address: MunicipalityAddress;
  surfaceArea: number;
};

export type Tenant = { structureType: TenantStructureType; name: string };
export type Owner = { structureType: OwnerStructureType; name: string };

type ExpensePurposeCategory =
  | "rent"
  | "safety"
  | "site_management"
  | "soils_degradation"
  | "taxes"
  | "other";

export type Expense = {
  purpose: SiteYearlyExpensePurpose;
  purposeCategory: ExpensePurposeCategory;
  bearer: "owner" | "tenant";
  amount: number;
};

export type Income = {
  source: string;
  amount: number;
};
