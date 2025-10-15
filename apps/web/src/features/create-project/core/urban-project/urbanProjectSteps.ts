import {
  BuildingsUse,
  ExpressProjectCategory,
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
import z from "zod";

import { ProjectStakeholder } from "../project.types";

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
  "URBAN_PROJECT_EXPRESS_CREATION_RESULT",
  "URBAN_PROJECT_EXPRESS_SUMMARY",
] as const;

export type InformationalStep = (typeof INFORMATIONAL_STEPS)[number];

const INFORMATIONAL_STEPS_SET = new Set<InformationalStep>(INFORMATIONAL_STEPS);
export const isInformationalStep = (
  stepId: UrbanProjectCreationStep,
): stepId is InformationalStep => {
  return INFORMATIONAL_STEPS_SET.has(stepId as InformationalStep);
};

export const ANSWER_STEPS: AnswerStepId[] = [
  // Common
  "URBAN_PROJECT_CREATE_MODE_SELECTION",
  // Express
  "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION",
  // Custom
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
export const isAnswersStep = (stepId: UrbanProjectCreationStep): stepId is AnswerStepId => {
  return ANSWER_STEPS_SET.has(stepId as AnswerStepId);
};

export type CustomFormAnswers = {
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
  // Common
  URBAN_PROJECT_CREATE_MODE_SELECTION: { createMode?: "custom" | "express" };
  // Express
  URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION: {
    expressCategory?: Extract<
      ExpressProjectCategory,
      | "PUBLIC_FACILITIES"
      | "RESIDENTIAL_TENSE_AREA"
      | "RESIDENTIAL_NORMAL_AREA"
      | "NEW_URBAN_CENTER"
    >;
  };
  // Custom
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: Pick<CustomFormAnswers, "spacesCategories">;
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: Pick<
    CustomFormAnswers,
    "spacesCategoriesDistribution"
  >;
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: Pick<
    CustomFormAnswers,
    "greenSpacesDistribution"
  >;
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: Pick<
    CustomFormAnswers,
    "livingAndActivitySpacesDistribution"
  >;
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: Pick<CustomFormAnswers, "publicSpacesDistribution">;
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: Pick<CustomFormAnswers, "decontaminationPlan">;
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: Pick<
    CustomFormAnswers,
    "decontaminatedSurfaceArea"
  >;
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: Pick<CustomFormAnswers, "buildingsFloorSurfaceArea">;
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: Pick<
    CustomFormAnswers,
    "buildingsUsesDistribution"
  >;
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: Pick<CustomFormAnswers, "projectDeveloper">;
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: Pick<
    CustomFormAnswers,
    "reinstatementContractOwner"
  >;
  URBAN_PROJECT_SITE_RESALE_SELECTION: Pick<
    CustomFormAnswers,
    "siteResalePlannedAfterDevelopment" | "futureSiteOwner"
  >;
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: Pick<
    CustomFormAnswers,
    "buildingsResalePlannedAfterDevelopment" | "futureOperator"
  >;
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: Pick<
    CustomFormAnswers,
    "sitePurchaseSellingPrice" | "sitePurchasePropertyTransferDuties"
  >;
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: Pick<CustomFormAnswers, "reinstatementExpenses">;
  URBAN_PROJECT_EXPENSES_INSTALLATION: Pick<CustomFormAnswers, "installationExpenses">;
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: Pick<
    CustomFormAnswers,
    "yearlyProjectedBuildingsOperationsExpenses"
  >;
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: Pick<
    CustomFormAnswers,
    "siteResaleExpectedSellingPrice" | "siteResaleExpectedPropertyTransferDuties"
  >;
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: Pick<
    CustomFormAnswers,
    "buildingsResaleSellingPrice" | "buildingsResalePropertyTransferDuties"
  >;
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: Pick<
    CustomFormAnswers,
    "yearlyProjectedRevenues"
  >;
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: Pick<
    CustomFormAnswers,
    "financialAssistanceRevenues"
  >;
  URBAN_PROJECT_SCHEDULE_PROJECTION: Pick<
    CustomFormAnswers,
    "reinstatementSchedule" | "installationSchedule" | "firstYearOfOperation"
  >;
  URBAN_PROJECT_NAMING: Pick<CustomFormAnswers, "name" | "description">;
  URBAN_PROJECT_PROJECT_PHASE: Pick<CustomFormAnswers, "projectPhase">;
};

export const BUILDINGS_STEPS = [
  "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
  "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
  "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
  "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
  "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
] as const;

export type UrbanProjectCreationStep = InformationalStep | AnswerStepId;

const urbanProjectCreationSteps = z.enum([...INFORMATIONAL_STEPS, ...ANSWER_STEPS]);

export const isUrbanProjectCreationStep = (step: string): step is UrbanProjectCreationStep => {
  return urbanProjectCreationSteps.safeParse(step).success;
};
