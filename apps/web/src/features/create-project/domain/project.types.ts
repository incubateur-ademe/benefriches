import { SoilsDistribution, SoilType } from "shared";
import { Schedule } from "../application/saveReconversionProject.action";

import { UserStructureType } from "@/features/users/domain/user";
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

export type ReinstatementCostsPurpose =
  | "asbestos_removal"
  | "deimpermeabilization"
  | "demolition"
  | "other_reinstatement"
  | "remediation"
  | "sustainable_soils_reinstatement"
  | "waste_collection";

export type ReinstatementCost = { purpose: ReinstatementCostsPurpose; amount: number };

export type PhotovoltaicInstallationCost = {
  amount: number;
  purpose: "technical_studies" | "installation_works" | "other";
};

export type FinancialAssistanceRevenue = {
  amount: number;
  source: "local_or_regional_authority_participation" | "public_subsidies" | "other";
};

export type ReconversionProjectCreationData = {
  id: string;
  name: string;
  description?: string;
  relatedSiteId: string;
  developmentPlanCategory: DevelopmentPlanCategory;
  renewableEnergyType: RenewableEnergyDevelopmentPlanType;
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
  photovoltaicInstallationElectricalPowerKWc: number;
  photovoltaicInstallationSurfaceSquareMeters: number;
  photovoltaicExpectedAnnualProduction: number;
  photovoltaicContractDuration: number;
  projectDeveloper: ProjectStakeholder;
  futureOperator: ProjectStakeholder;
  futureSiteOwner: ProjectStakeholder;
  conversionFullTimeJobsInvolved?: number;
  reinstatementFullTimeJobsInvolved?: number;
  reinstatementContractOwner?: ProjectStakeholder;
  operationsFullTimeJobsInvolved?: number;
  // soils transformation
  baseSoilsDistributionForTransformation: SoilsDistribution;
  soilsDistribution: SoilsDistribution;
  nonSuitableSoilsToTransform: SoilType[];
  futureSoilsSelection: SoilType[];
  // real estate transaction
  hasRealEstateTransaction: boolean;
  realEstateTransactionSellingPrice?: number;
  realEstateTransactionPropertyTransferDuties?: number;
  // costs
  reinstatementCosts?: ReinstatementCost[];
  photovoltaicPanelsInstallationCosts: PhotovoltaicInstallationCost[];
  yearlyProjectedCosts: RecurringCost[];
  // revenues
  yearlyProjectedRevenues: RecurringRevenue[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  // schedules
  reinstatementSchedule?: Schedule;
  photovoltaicInstallationSchedule?: Schedule;
  firstYearOfOperation?: number;
  // project phase
  projectPhase: ProjectPhase;
  projectPhaseDetails?: ProjectPhaseDetails;
};

export type DocumentType = "BUILDING_PERMIT" | "FORECAST_BALANCE_SHEET";

export type RecurringCost = {
  amount: number;
  purpose: "rent" | "maintenance" | "taxes" | "other";
};

export type RecurringRevenue = {
  amount: number;
  source: "operations" | "other";
};

export type ProjectStakeholderStructure =
  | OwnerStructureType
  | TenantStructureType
  | "company"
  | LocalAutorityStructureType
  | "other"
  | UserStructureType
  | "unknown";

export type ProjectStakeholder = { name: string; structureType: ProjectStakeholderStructure };

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
  soilsDistribution: SoilsDistribution;
  surfaceArea: number;
  address: Address;
};

export const getLabelForRecurringCostPurpose = (costPurpose: RecurringCost["purpose"]): string => {
  switch (costPurpose) {
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
export const getLabelForRecurringRevenueSource = (
  revenueSource: RecurringRevenue["source"],
): string => {
  switch (revenueSource) {
    case "operations":
      return "Recettes d'exploitation";
    case "other":
      return "Autres recettes";
  }
};

export const getLabelForFinancialAssistanceRevenueSource = (
  financialAssitanceSource: FinancialAssistanceRevenue["source"],
): string => {
  switch (financialAssitanceSource) {
    case "local_or_regional_authority_participation":
      return "Participation des collectivités";
    case "public_subsidies":
      return "Subventions publiques";
    case "other":
      return "Autres ressources";
  }
};

export const getLabelForPhotovoltaicInstallationCostPurpose = (
  photovoltaicCostPurpose: PhotovoltaicInstallationCost["purpose"],
): string => {
  switch (photovoltaicCostPurpose) {
    case "technical_studies":
      return "📋 Études et honoraires techniques";
    case "installation_works":
      return "🛠 Travaux d'installation des panneaux";
    case "other":
      return "⚡️ Autres frais d'installation des panneaux";
  }
};

export const getLabelForReinstatementCostPurpose = (
  costPurpose: ReinstatementCostsPurpose,
): string => {
  switch (costPurpose) {
    case "asbestos_removal":
      return "☣️ Désamiantage";
    case "sustainable_soils_reinstatement":
      return "🌱 Restauration écologique";
    case "deimpermeabilization":
      return "🌧 Désimperméabilisation";
    case "remediation":
      return "✨ Dépollution des sols";
    case "demolition":
      return "🧱 Déconstruction";
    case "waste_collection":
      return "♻️ Évacuation et traitement des déchets";
    default:
      return "🏗 Autres dépenses de remise en état";
  }
};
