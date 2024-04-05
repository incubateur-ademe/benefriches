import { Schedule } from "../application/saveReconversionProject.action";

import { SoilType } from "@/shared/domain/soils";
import {
  LocalAutorityStructureType,
  OwnerStructureType,
  TenantStructureType,
} from "@/shared/domain/stakeholder";

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

export type ProjectPhase =
  | "setup"
  | "planning"
  | "design"
  | "construction"
  | "completed"
  | "unknown";

export type ProjectPhaseDetails =
  | "setup_opportunity_and_feasibility_analysis"
  | "setup_scenario_selection_and_implementation"
  | "design_preliminary_draft"
  | "design_final_draft"
  | "design_pro_or_permit_filing_or_contract_awarding";

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
  // project phase
  projectPhase: ProjectPhase;
  projectPhaseDetails?: ProjectPhaseDetails;
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
