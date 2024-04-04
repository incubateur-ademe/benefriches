import { Schedule } from "../application/saveReconversionProject.action";

import { SoilType } from "@/shared/domain/soils";
import {
  LocalAutorityStructureType,
  OwnerStructureType,
  TenantStructureType,
} from "@/shared/domain/stakeholder";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";

export type DevelopmentPlanCategory =
  | "RENEWABLE_ENERGY"
  | "URBAN_AGRICULTURE"
  | "BUILDINGS"
  | "NATURAL_URBAN_SPACES"
  | "COMMERCIAL_ACTIVITY_AREA";

export type RenewableEnergyDevelopmentPlanType =
  | "PHOTOVOLTAIC_POWER_PLANT"
  | "AGRIVOLTAIC"
  | "GEOTHERMAL"
  | "BIOMASS";

export enum PhotovoltaicKeyParameter {
  POWER = "POWER",
  SURFACE = "SURFACE",
}

export type ReconversionProjectCreationData = {
  id: string;
  name: string;
  description?: string;
  relatedSiteId: string;
  developmentPlanCategories: DevelopmentPlanCategory[];
  renewableEnergyTypes: RenewableEnergyDevelopmentPlanType[];
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
  photovoltaicInstallationElectricalPowerKWc: number;
  photovoltaicInstallationSurfaceSquareMeters: number;
  photovoltaicExpectedAnnualProduction: number;
  photovoltaicContractDuration: number;
  futureOperator: ProjectStakeholder;
  futureSiteOwner: ProjectStakeholder;
  conversionFullTimeJobsInvolved?: number;
  reinstatementFullTimeJobsInvolved?: number;
  reinstatementContractOwner?: ProjectStakeholder;
  operationsFullTimeJobsInvolved?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  // real estate transaction
  hasRealEstateTransaction: boolean;
  realEstateTransactionSellingPrice?: number;
  realEstateTransactionPropertyTransferDuties?: number;
  // costs
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  reinstatementFinancialAssistanceAmount: number;
  yearlyProjectedCosts: Expense[];
  // revenues
  yearlyProjectedRevenues: Revenue[];
  // schedules
  reinstatementSchedule?: Schedule;
  photovoltaicInstallationSchedule?: Schedule;
  firstYearOfOperation?: number;
};

export type DocumentType = "BUILDING_PERMIT" | "FORECAST_BALANCE_SHEET";

export type Expense = {
  amount: number;
  purpose: "rent" | "maintenance" | "taxes" | "other";
};

export type Revenue = {
  amount: number;
  source: "operations" | "other";
};

type ProjectStakeholderStructure =
  | OwnerStructureType
  | TenantStructureType
  | "company"
  | LocalAutorityStructureType
  | "other"
  | "unknown";

export type ProjectStakeholder = { name: string; structureType: ProjectStakeholderStructure };

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

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  owner: {
    name: string;
    structureType: OwnerStructureType;
  };
  tenant?: {
    name: string;
    structureType: TenantStructureType;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: Address;
};

const getPrevisionalEnrSocioEconomicImpactPerHectare = (
  renewableEnergyProductionType: RenewableEnergyDevelopmentPlanType,
) => {
  switch (renewableEnergyProductionType) {
    case "AGRIVOLTAIC":
      return 21000;
    case "BIOMASS":
      return 11000;
    case "GEOTHERMAL":
      return 10000;
    case "PHOTOVOLTAIC_POWER_PLANT":
      return 10000;
  }
};

export const getPrevisionalEnrSocioEconomicImpact = (
  renewableEnergyProductionType: RenewableEnergyDevelopmentPlanType,
  siteSurfaceArea: number,
) => {
  return Math.round(
    getPrevisionalEnrSocioEconomicImpactPerHectare(renewableEnergyProductionType) *
      convertSquareMetersToHectares(siteSurfaceArea),
  );
};

export const getLabelForExpensePurpose = (expensePurpose: Expense["purpose"]): string => {
  switch (expensePurpose) {
    case "taxes":
      return "Impôts et taxes";
    case "other":
      return "Autres dépenses";
    case "rent":
      return "Loyer";
    case "maintenance":
      return "Maintenance";
  }
};
export const getLabelForRevenueSource = (revenueSource: Revenue["source"]): string => {
  switch (revenueSource) {
    case "operations":
      return "Recettes d'exploitation";
    case "other":
      return "Autres recettes";
  }
};
