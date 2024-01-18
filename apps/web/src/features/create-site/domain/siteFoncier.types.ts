import { FricheActivity } from "./friche.types";

import { SoilType } from "@/shared/domain/soils";

export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type Address = {
  id: string;
  value: string;
  city: string;
  cityCode: string;
  postCode: string;
  streetNumber?: string;
  streetName?: string;
  long: number;
  lat: number;
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
  soilsDistribution: Partial<Record<SoilType, number>>;
  // contamination
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  fricheActivity?: FricheActivity;
  // management
  fullTimeJobsInvolved?: number;
  owner: { structureType: OwnerStructureType; name: string };
  tenant: { structureType: TenantStructureType; name: string };
  hasRecentAccidents: boolean;
  minorInjuriesPersons?: number;
  severeInjuriesPersons?: number;
  deaths?: number;
  yearlyExpenses: Expense[];
  yearlyIncomes: Income[];
};

export type OwnerStructureType = "local_or_regional_authority" | "company" | "private_individual";

export type TenantStructureType = "local_or_regional_authority" | "company";

export type Expense = {
  type: string;
  bearer: "owner" | "tenant" | "local_or_regional_authority" | "society";
  category: "rent" | "safety" | "site_management" | "soils_degradation" | "taxes" | "other";
  amount: number;
};

export type Income = {
  type: string;
  amount: number;
};
