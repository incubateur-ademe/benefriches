import {
  BuildingsUse,
  FinancialAssistanceRevenue,
  RecurringExpense,
  ReinstatementExpense,
  SurfaceAreaDistributionJson,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanProjectDevelopmentExpense,
  UrbanProjectPhase,
  UrbanPublicSpace,
  UrbanSpaceCategory,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import { ProjectStakeholder } from "../project.types";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";

export const INFORMATIONAL_STEPS = [
  "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
  "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
  "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION",
  "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
  "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION",
  "URBAN_PROJECT_SPACES_SOILS_SUMMARY",
  "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
  "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",
  "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
  "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
  "URBAN_PROJECT_EXPENSES_INTRODUCTION",
  "URBAN_PROJECT_REVENUE_INTRODUCTION",
  "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
  "URBAN_PROJECT_FINAL_SUMMARY",
  "URBAN_PROJECT_CREATION_RESULT",
] as const;

export type InformationalStep = (typeof INFORMATIONAL_STEPS)[number];

const INFORMATIONAL_STEPS_SET = new Set<InformationalStep>(INFORMATIONAL_STEPS);
export const isInformationalStep = (
  stepId: UrbanProjectCustomCreationStep,
): stepId is InformationalStep => {
  return INFORMATIONAL_STEPS_SET.has(stepId as InformationalStep);
};

export const ANSWER_STEPS: AnswerStepId[] = [
  "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
  "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
  "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
  "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
  "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
  "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
  "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
  "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
  "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
  "URBAN_PROJECT_SITE_RESALE_SELECTION",
  "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
  "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
  "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
  "URBAN_PROJECT_EXPENSES_INSTALLATION",
  "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
  "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
  "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
  "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
  "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
  "URBAN_PROJECT_SCHEDULE_PROJECTION",
  "URBAN_PROJECT_NAMING",
  "URBAN_PROJECT_PROJECT_PHASE",
] as const;

export type AnswerStepId = keyof AnswersByStep;

const ANSWER_STEPS_SET = new Set<AnswerStepId>(ANSWER_STEPS);
export const isAnswersStep = (stepId: UrbanProjectCustomCreationStep): stepId is AnswerStepId => {
  return ANSWER_STEPS_SET.has(stepId as AnswerStepId);
};

export type FormAnswers = {
  spacesCategories?: UrbanSpaceCategory[];
  spacesCategoriesDistribution?: Partial<Record<UrbanSpaceCategory, number>>;
  greenSpacesDistribution?: Partial<Record<UrbanGreenSpace, number>>;
  livingAndActivitySpacesDistribution?: Partial<Record<UrbanLivingAndActivitySpace, number>>;
  publicSpacesDistribution?: Partial<Record<UrbanPublicSpace, number>>;
  decontaminationPlan?: "partial" | "none" | "unknown";
  decontaminatedSurfaceArea?: number;
  buildingsFloorSurfaceArea?: number;
  buildingsUsesDistribution?: SurfaceAreaDistributionJson<BuildingsUse>;
  projectDeveloper?: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
  siteResalePlannedAfterDevelopment?: boolean;
  futureSiteOwner?: ProjectStakeholder;
  buildingsResalePlannedAfterDevelopment?: boolean;
  futureOperator?: ProjectStakeholder;
  sitePurchaseSellingPrice?: number;
  sitePurchasePropertyTransferDuties?: number;
  reinstatementExpenses?: ReinstatementExpense[];
  installationExpenses?: UrbanProjectDevelopmentExpense[];
  yearlyProjectedBuildingsOperationsExpenses?: RecurringExpense[];
  siteResaleExpectedSellingPrice?: number;
  siteResaleExpectedPropertyTransferDuties?: number;
  buildingsResaleSellingPrice?: number;
  buildingsResalePropertyTransferDuties?: number;
  yearlyProjectedRevenues?: YearlyBuildingsOperationsRevenues[];
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementSchedule?: {
    startDate: string;
    endDate: string;
  };
  installationSchedule?: {
    startDate: string;
    endDate: string;
  };
  firstYearOfOperation?: number;
  name?: string;
  description?: string;
  projectPhase?: UrbanProjectPhase;
};
export type AnswersByStep = {
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: Pick<FormAnswers, "spacesCategories">;
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: Pick<FormAnswers, "spacesCategoriesDistribution">;
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: Pick<
    FormAnswers,
    "greenSpacesDistribution"
  >;
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: Pick<
    FormAnswers,
    "livingAndActivitySpacesDistribution"
  >;
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: Pick<FormAnswers, "publicSpacesDistribution">;
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: Pick<FormAnswers, "decontaminationPlan">;
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: Pick<FormAnswers, "decontaminatedSurfaceArea">;
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: Pick<FormAnswers, "buildingsFloorSurfaceArea">;
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: Pick<
    FormAnswers,
    "buildingsUsesDistribution"
  >;
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: Pick<FormAnswers, "projectDeveloper">;
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: Pick<
    FormAnswers,
    "reinstatementContractOwner"
  >;
  URBAN_PROJECT_SITE_RESALE_SELECTION: Pick<
    FormAnswers,
    "siteResalePlannedAfterDevelopment" | "futureSiteOwner"
  >;
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: Pick<
    FormAnswers,
    "buildingsResalePlannedAfterDevelopment" | "futureOperator"
  >;
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: Pick<
    FormAnswers,
    "sitePurchaseSellingPrice" | "sitePurchasePropertyTransferDuties"
  >;
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: Pick<FormAnswers, "reinstatementExpenses">;
  URBAN_PROJECT_EXPENSES_INSTALLATION: Pick<FormAnswers, "installationExpenses">;
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: Pick<
    FormAnswers,
    "yearlyProjectedBuildingsOperationsExpenses"
  >;
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: Pick<
    FormAnswers,
    "siteResaleExpectedSellingPrice" | "siteResaleExpectedPropertyTransferDuties"
  >;
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: Pick<
    FormAnswers,
    "buildingsResaleSellingPrice" | "buildingsResalePropertyTransferDuties"
  >;
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: Pick<
    FormAnswers,
    "yearlyProjectedRevenues"
  >;
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: Pick<FormAnswers, "financialAssistanceRevenues">;
  URBAN_PROJECT_SCHEDULE_PROJECTION: Pick<
    FormAnswers,
    "reinstatementSchedule" | "installationSchedule" | "firstYearOfOperation"
  >;
  URBAN_PROJECT_NAMING: Pick<FormAnswers, "name" | "description">;
  URBAN_PROJECT_PROJECT_PHASE: Pick<FormAnswers, "projectPhase">;
};

export const BUILDINGS_STEPS = [
  "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
  "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
  "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
  "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
  "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
] as const;
