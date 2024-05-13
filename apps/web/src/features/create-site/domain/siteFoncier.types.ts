import { SoilsDistribution, SoilType } from "shared";
import { FricheActivity } from "./friche.types";

import { OwnerStructureType, SiteOperatorStructureType } from "@/shared/domain/stakeholder";

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
  fullTimeJobsInvolved?: number;
  owner: { structureType: OwnerStructureType; name: string };
  operator?: { structureType: SiteOperatorStructureType; name: string };
  hasOperator?: boolean;
  hasRecentAccidents?: boolean;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: Expense[];
  yearlyIncomes: Income[];
};

export type Operator = { structureType: SiteOperatorStructureType; name: string };
export type Owner = { structureType: OwnerStructureType; name: string };

export type ExpensePurpose =
  | "rent"
  | "propertyTaxes"
  | "operationsTaxes"
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
  bearer: "owner" | "operator" | "local_or_regional_authority" | "society";
  amount: number;
};

export type Income = {
  source: string;
  amount: number;
};
