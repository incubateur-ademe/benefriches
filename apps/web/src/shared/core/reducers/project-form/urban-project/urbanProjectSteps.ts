import { createReconversionProjectSchema, typedObjectKeys } from "shared";
import z from "zod";

import { buildingsExistingBuildingsUsesFloorSurfaceAreaSchema } from "./step-handlers/buildings/buildings-existing-buildings-uses-floor-surface-area/buildingsExistingBuildingsUsesFloorSurfaceArea.schema";
import { buildingsFootprintToReuseSchema } from "./step-handlers/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.schema";
import { buildingsNewBuildingsUsesFloorSurfaceAreaSchema } from "./step-handlers/buildings/buildings-new-buildings-uses-floor-surface-area/buildingsNewBuildingsUsesFloorSurfaceArea.schema";
import { buildingsUsesFloorSurfaceAreaSchema } from "./step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.schema";
import { creationModeSelectionSchema } from "./step-handlers/creation-mode/creation-mode-selection/creationModeSelection.schema";
import { expensesBuildingsConstructionAndRehabilitationSchema } from "./step-handlers/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.schema";
import { expensesInstallationSchema } from "./step-handlers/expenses/expenses-installation/expensesInstallation.schema";
import { expensesProjectedBuildingsOperatingExpensesSchema } from "./step-handlers/expenses/expenses-projected-buildings-operating-expenses/expensesProjectedBuildingsOperatingExpenses.schema";
import { expensesReinstatementSchema } from "./step-handlers/expenses/expenses-reinstatement/expensesReinstatement.schema";
import { expensesSitePurchaseAmountsSchema } from "./step-handlers/expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.schema";
import { expressTemplateSelectionSchema } from "./step-handlers/express/express-template-selection/expressTemplateSelection.schema";
import { namingSchema } from "./step-handlers/naming/naming/naming.schema";
import { projectPhaseSchema } from "./step-handlers/project-phase/project-phase/projectPhase.schema";
import { revenueBuildingsOperationsYearlyRevenuesSchema } from "./step-handlers/revenues/revenue-buildings-operations-yearly-revenues/revenueBuildingsOperationsYearlyRevenues.schema";
import { revenueBuildingsResaleSchema } from "./step-handlers/revenues/revenue-buildings-resale/revenueBuildingsResale.schema";
import { revenueExpectedSiteResaleSchema } from "./step-handlers/revenues/revenue-expected-site-resale/revenueExpectedSiteResale.schema";
import { revenueFinancialAssistanceSchema } from "./step-handlers/revenues/revenue-financial-assistance/revenueFinancialAssistance.schema";
import { scheduleProjectionSchema } from "./step-handlers/schedule/schedule-projection/scheduleProjection.schema";
import { buildingsResaleSelectionSchema } from "./step-handlers/site-and-buildings-resale/buildings-resale-selection/buildingsResaleSelection.schema";
import { siteResaleSelectionSchema } from "./step-handlers/site-and-buildings-resale/site-resale-selection/siteResaleSelection.schema";
import { soilsDecontaminationSelectionSchema } from "./step-handlers/soils/soils-decontamination-selection/soilsDecontaminationSelection.schema";
import { soilsDecontaminationSurfaceAreaSchema } from "./step-handlers/soils/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.schema";
import { publicGreenSpacesSoilsDistributionSchema } from "./step-handlers/spaces/public-green-spaces-soils-distribution/publicGreenSpacesSoilsDistribution.schema";
import { spacesSelectionSchema } from "./step-handlers/spaces/spaces-selection/spacesSelection.schema";
import { spacesSurfaceAreaSchema } from "./step-handlers/spaces/spaces-surface-area/spacesSurfaceArea.schema";
import { stakeholdersBuildingsDeveloperSchema } from "./step-handlers/stakeholders/stakeholders-buildings-developer/stakeholdersBuildingsDeveloper.schema";
import { stakeholdersProjectDeveloperSchema } from "./step-handlers/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.schema";
import { stakeholdersReinstatementContractOwnerSchema } from "./step-handlers/stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.schema";
import { publicGreenSpacesSurfaceAreaSchema } from "./step-handlers/uses/public-green-spaces-surface-area/publicGreenSpacesSurfaceArea.schema";
import { usesSelectionSchema } from "./step-handlers/uses/selection/usesSelection.schema";

export const INTRODUCTION_STEPS = [
  "URBAN_PROJECT_USES_INTRODUCTION",
  "URBAN_PROJECT_SPACES_INTRODUCTION",
  "URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION",
  "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO",
  "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO",
  "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
  "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
  "URBAN_PROJECT_EXPENSES_INTRODUCTION",
  "URBAN_PROJECT_REVENUE_INTRODUCTION",
] as const;

export const SUMMARY_STEPS = [
  "URBAN_PROJECT_SPACES_SOILS_SUMMARY",
  "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
  "URBAN_PROJECT_FINAL_SUMMARY",
  "URBAN_PROJECT_CREATION_RESULT",
  "URBAN_PROJECT_EXPRESS_CREATION_RESULT",
  "URBAN_PROJECT_EXPRESS_SUMMARY",
] as const;

export type SummaryStep = (typeof SUMMARY_STEPS)[number];
export type IntroductionStep = (typeof INTRODUCTION_STEPS)[number];

const SUMMARY_STEPS_SET = new Set<SummaryStep>(SUMMARY_STEPS);
export const isSummaryStep = (stepId: UrbanProjectCreationStep): stepId is SummaryStep => {
  return SUMMARY_STEPS_SET.has(stepId as SummaryStep);
};

const urbanProjectFormDataSchema = createReconversionProjectSchema(z.string()).omit({
  createdBy: true,
  id: true,
  relatedSiteId: true,
  createdAt: true,
  updatedAt: true,
  creationMode: true,
});

type ReconversionProject = z.infer<typeof urbanProjectFormDataSchema>;
export type UrbanProjectFormData = Omit<ReconversionProject, "developmentPlan"> & {
  developmentPlan: Extract<ReconversionProject["developmentPlan"], { type: "URBAN_PROJECT" }>;
};

export const answersByStepSchemas = {
  // Common
  URBAN_PROJECT_CREATE_MODE_SELECTION: creationModeSelectionSchema,

  // Express
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: expressTemplateSelectionSchema,

  // Custom - uses
  URBAN_PROJECT_USES_SELECTION: usesSelectionSchema,

  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: publicGreenSpacesSurfaceAreaSchema,

  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: publicGreenSpacesSoilsDistributionSchema,

  // Custom - spaces
  URBAN_PROJECT_SPACES_SELECTION: spacesSelectionSchema,

  URBAN_PROJECT_SPACES_SURFACE_AREA: spacesSurfaceAreaSchema,

  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: soilsDecontaminationSelectionSchema,

  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: soilsDecontaminationSurfaceAreaSchema,

  // custom - buildings
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: buildingsUsesFloorSurfaceAreaSchema,
  URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: buildingsFootprintToReuseSchema,
  URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA:
    buildingsExistingBuildingsUsesFloorSurfaceAreaSchema,
  URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA:
    buildingsNewBuildingsUsesFloorSurfaceAreaSchema,

  // custom - stakeholders
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: stakeholdersProjectDeveloperSchema,
  URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: stakeholdersBuildingsDeveloperSchema,

  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    stakeholdersReinstatementContractOwnerSchema,

  URBAN_PROJECT_SITE_RESALE_SELECTION: siteResaleSelectionSchema,

  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: buildingsResaleSelectionSchema,

  // Custom - expenses
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: expensesSitePurchaseAmountsSchema,

  URBAN_PROJECT_EXPENSES_REINSTATEMENT: expensesReinstatementSchema,

  URBAN_PROJECT_EXPENSES_INSTALLATION: expensesInstallationSchema,

  URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION:
    expensesBuildingsConstructionAndRehabilitationSchema,

  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES:
    expensesProjectedBuildingsOperatingExpensesSchema,

  // custom - revenues
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: revenueExpectedSiteResaleSchema,

  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: revenueBuildingsResaleSchema,

  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES:
    revenueBuildingsOperationsYearlyRevenuesSchema,

  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: revenueFinancialAssistanceSchema,

  // custom - schedule, naming, phase
  URBAN_PROJECT_SCHEDULE_PROJECTION: scheduleProjectionSchema,

  URBAN_PROJECT_NAMING: namingSchema,

  URBAN_PROJECT_PROJECT_PHASE: projectPhaseSchema,
};

export const ANSWER_STEPS = typedObjectKeys(answersByStepSchemas);
const ANSWER_STEPS_SET = new Set<AnswerStepId>(ANSWER_STEPS);
export const isAnswersStep = (stepId: UrbanProjectCreationStep): stepId is AnswerStepId => {
  return ANSWER_STEPS_SET.has(stepId as AnswerStepId);
};

export type AnswerStepId = keyof typeof answersByStepSchemas;
export type AnswersByStep = {
  [K in keyof typeof answersByStepSchemas]: Partial<z.infer<(typeof answersByStepSchemas)[K]>>;
};

export const BUILDINGS_STEPS = [
  "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
  "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
  "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
  "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
  "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
  "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
] as const;

export type UrbanProjectCreationStep = IntroductionStep | SummaryStep | AnswerStepId;

const urbanProjectCreationSteps = z.enum([
  ...INTRODUCTION_STEPS,
  ...SUMMARY_STEPS,
  ...ANSWER_STEPS,
]);

export const isUrbanProjectCreationStep = (step: string): step is UrbanProjectCreationStep => {
  return urbanProjectCreationSteps.safeParse(step).success;
};
