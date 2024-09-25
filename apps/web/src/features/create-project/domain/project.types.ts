import {
  DevelopmentPlanCategory,
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  ProjectPhase,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
} from "shared";
import { Schedule } from "../application/saveReconversionProject.action";

import { UserStructureType } from "@/features/users/domain/user";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";
import { OwnerStructureType, TenantStructureType } from "@/shared/domain/stakeholder";

export type PhotovoltaicKeyParameter = "POWER" | "SURFACE";

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
  decontaminatedSurfaceArea?: number;
  // soils transformation
  baseSoilsDistributionForTransformation: SoilsDistribution;
  soilsDistribution: SoilsDistribution;
  nonSuitableSoilsToTransform: SoilType[];
  futureSoilsSelection: SoilType[];
  // site purchase
  willSiteBePurchased: boolean;
  sitePurchaseSellingPrice?: number;
  sitePurchasePropertyTransferDuties?: number;
  // expenses
  reinstatementExpenses?: ReinstatementExpense[];
  photovoltaicPanelsInstallationExpenses: PhotovoltaicInstallationExpense[];
  yearlyProjectedExpenses: RecurringExpense[];
  // revenues
  yearlyProjectedRevenues: RecurringRevenue[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  // schedules
  reinstatementSchedule?: Schedule;
  photovoltaicInstallationSchedule?: Schedule;
  firstYearOfOperation?: number;
  // project phase
  projectPhase: ProjectPhase;
};

export type ProjectStakeholderStructure =
  | OwnerStructureType
  | TenantStructureType
  | "company"
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
  isExpressSite: boolean;
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
