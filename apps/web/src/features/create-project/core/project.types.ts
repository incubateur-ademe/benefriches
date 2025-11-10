import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  RenewableEnergyProjectPhase,
  SoilsDistribution,
  SoilType,
  SoilsTransformationProject,
  ReconversionProjectTemplate,
} from "shared";

import { UserStructureType } from "@/features/onboarding/core/user";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";
import { ProjectSiteView } from "@/shared/core/reducers/project-form/projectForm.types";
import { SiteStakeholderStructureType } from "@/shared/core/stakeholder";

export type PhotovoltaicKeyParameter = "POWER" | "SURFACE";

export type Schedule = {
  startDate: string;
  endDate: string;
};

export type ProjectSuggestion = {
  type: ReconversionProjectTemplate;
  compatibilityScore: number;
};

export type ReconversionProjectCreationData = {
  name: string;
  description?: string;
  relatedSiteId: string;
  renewableEnergyType: RenewableEnergyDevelopmentPlanType;
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
  photovoltaicInstallationElectricalPowerKWc: number;
  photovoltaicInstallationSurfaceSquareMeters: number;
  photovoltaicExpectedAnnualProduction: number;
  photovoltaicContractDuration: number;
  projectDeveloper: ProjectStakeholder;
  futureOperator: ProjectStakeholder;
  futureSiteOwner: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
  decontaminatedSurfaceArea?: number;
  decontaminationPlan?: "none" | "partial" | "unknown";
  // soils transformation
  nonSuitableSoilsSurfaceAreaToTransform: SoilsDistribution;
  baseSoilsDistributionForTransformation: SoilsDistribution;
  soilsDistribution: SoilsDistribution;
  nonSuitableSoilsToTransform: SoilType[];
  soilsTransformationProject?: SoilsTransformationProject;
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
  projectPhase?: RenewableEnergyProjectPhase;
};

export type ProjectStakeholderStructure =
  | SiteStakeholderStructureType
  | UserStructureType
  | "unknown";

export type ProjectStakeholder = { name: string; structureType: ProjectStakeholderStructure };

export type ProjectSite = ProjectSiteView;
