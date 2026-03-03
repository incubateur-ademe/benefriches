import { typedObjectKeys } from "shared";
import z from "zod";

import { expensesInstallationSchema } from "./step-handlers/expenses/expenses-installation/expensesInstallation.schema";
import { expensesReinstatementSchema } from "./step-handlers/expenses/expenses-reinstatement/expensesReinstatement.schema";
import { expensesSitePurchaseAmountsSchema } from "./step-handlers/expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.schema";
import { expensesYearlyProjectedExpensesSchema } from "./step-handlers/expenses/expenses-yearly-projected/expensesYearlyProjected.schema";
import { namingSchema } from "./step-handlers/naming/naming/naming.schema";
import { photovoltaicContractDurationSchema } from "./step-handlers/photovoltaic/photovoltaic-contract-duration/photovoltaicContractDuration.schema";
import { photovoltaicExpectedAnnualProductionSchema } from "./step-handlers/photovoltaic/photovoltaic-expected-annual-production/photovoltaicExpectedAnnualProduction.schema";
import { photovoltaicKeyParameterSchema } from "./step-handlers/photovoltaic/photovoltaic-key-parameter/photovoltaicKeyParameter.schema";
import { photovoltaicPowerSchema } from "./step-handlers/photovoltaic/photovoltaic-power/photovoltaicPower.schema";
import { photovoltaicSurfaceSchema } from "./step-handlers/photovoltaic/photovoltaic-surface/photovoltaicSurface.schema";
import { projectPhaseSchema } from "./step-handlers/project-phase/project-phase/projectPhase.schema";
import { revenueFinancialAssistanceSchema } from "./step-handlers/revenue/revenue-financial-assistance/revenueFinancialAssistance.schema";
import { revenueYearlyProjectedRevenueSchema } from "./step-handlers/revenue/revenue-yearly-projected/revenueYearlyProjected.schema";
import { scheduleProjectionSchema } from "./step-handlers/schedule/schedule-projection/scheduleProjection.schema";
import { soilsDecontaminationSelectionSchema } from "./step-handlers/soils-decontamination/soils-decontamination-selection/soilsDecontaminationSelection.schema";
import { soilsDecontaminationSurfaceAreaSchema } from "./step-handlers/soils-decontamination/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.schema";
import { customSoilsSelectionSchema } from "./step-handlers/soils-transformation/soils-transformation-custom-soils-selection/soilsTransformationCustomSoilsSelection.schema";
import { customSurfaceAreaAllocationSchema } from "./step-handlers/soils-transformation/soils-transformation-custom-surface-area-allocation/soilsTransformationCustomSurfaceAreaAllocation.schema";
import { nonSuitableSoilsSelectionSchema } from "./step-handlers/soils-transformation/soils-transformation-non-suitable-soils-selection/soilsTransformationNonSuitableSoilsSelection.schema";
import { nonSuitableSoilsSurfaceSchema } from "./step-handlers/soils-transformation/soils-transformation-non-suitable-soils-surface/soilsTransformationNonSuitableSoilsSurface.schema";
import { soilsTransformationProjectSelectionSchema } from "./step-handlers/soils-transformation/soils-transformation-project-selection/soilsTransformationProjectSelection.schema";
import { stakeholdersFutureOperatorSchema } from "./step-handlers/stakeholders/stakeholders-future-operator/stakeholdersFutureOperator.schema";
import { stakeholdersFutureSiteOwnerSchema } from "./step-handlers/stakeholders/stakeholders-future-site-owner/stakeholdersFutureSiteOwner.schema";
import { stakeholdersProjectDeveloperSchema } from "./step-handlers/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.schema";
import { stakeholdersReinstatementContractOwnerSchema } from "./step-handlers/stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.schema";
import { stakeholdersSitePurchaseSchema } from "./step-handlers/stakeholders/stakeholders-site-purchase/stakeholdersSitePurchase.schema";

export const INTRODUCTION_STEPS = [
  "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION",
  "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",
  "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE",
  "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",
  "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION",
  "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
  "RENEWABLE_ENERGY_REVENUE_INTRODUCTION",
] as const;

export const SUMMARY_STEPS = [
  "RENEWABLE_ENERGY_SOILS_SUMMARY",
  "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE",
  "RENEWABLE_ENERGY_FINAL_SUMMARY",
  "RENEWABLE_ENERGY_CREATION_RESULT",
] as const;

export type SummaryStep = (typeof SUMMARY_STEPS)[number];
export type IntroductionStep = (typeof INTRODUCTION_STEPS)[number];

const SUMMARY_STEPS_SET = new Set<SummaryStep>(SUMMARY_STEPS);
export const isSummaryStep = (stepId: RenewableEnergyCreationStep): stepId is SummaryStep => {
  return SUMMARY_STEPS_SET.has(stepId as SummaryStep);
};

export const answersByStepSchemas = {
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: photovoltaicKeyParameterSchema,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: photovoltaicPowerSchema,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: photovoltaicSurfaceSchema,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION:
    photovoltaicExpectedAnnualProductionSchema,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION: photovoltaicContractDurationSchema,
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: soilsDecontaminationSelectionSchema,
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA: soilsDecontaminationSurfaceAreaSchema,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: nonSuitableSoilsSelectionSchema,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: nonSuitableSoilsSurfaceSchema,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION:
    soilsTransformationProjectSelectionSchema,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: customSoilsSelectionSchema,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION:
    customSurfaceAreaAllocationSchema,
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: stakeholdersProjectDeveloperSchema,
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: stakeholdersFutureOperatorSchema,
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    stakeholdersReinstatementContractOwnerSchema,
  RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: stakeholdersSitePurchaseSchema,
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: stakeholdersFutureSiteOwnerSchema,
  RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: expensesSitePurchaseAmountsSchema,
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: expensesReinstatementSchema,
  RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: expensesInstallationSchema,
  RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: expensesYearlyProjectedExpensesSchema,
  RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE: revenueYearlyProjectedRevenueSchema,
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: revenueFinancialAssistanceSchema,
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: scheduleProjectionSchema,
  RENEWABLE_ENERGY_PROJECT_PHASE: projectPhaseSchema,
  RENEWABLE_ENERGY_NAMING: namingSchema,
};

export const ANSWER_STEPS = typedObjectKeys(answersByStepSchemas);
const ANSWER_STEPS_SET = new Set<AnswerStepId>(ANSWER_STEPS);
export const isAnswersStep = (stepId: RenewableEnergyCreationStep): stepId is AnswerStepId => {
  return ANSWER_STEPS_SET.has(stepId as AnswerStepId);
};

export type AnswerStepId = keyof typeof answersByStepSchemas;
export type AnswersByStep = {
  [K in keyof typeof answersByStepSchemas]: z.infer<(typeof answersByStepSchemas)[K]>;
};

export type RenewableEnergyCreationStep = IntroductionStep | SummaryStep | AnswerStepId;

const renewableEnergyCreationSteps = z.enum([
  ...INTRODUCTION_STEPS,
  ...SUMMARY_STEPS,
  ...ANSWER_STEPS,
]);

// Express steps stay separate (not part of step handler flow)
const renewableEnergyExpressCreationStep = z.enum(["RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY"]);

export type RenewableEnergyExpressCreationStep = z.infer<typeof renewableEnergyExpressCreationStep>;

export const isRenewableEnergyExpressCreationStep = (
  step: string,
): step is RenewableEnergyExpressCreationStep => {
  return renewableEnergyExpressCreationStep.safeParse(step).success;
};

// Pre-custom steps (handled by parent createProject.reducer)
export type PreCustomStep =
  | "RENEWABLE_ENERGY_CREATE_MODE_SELECTION"
  | "RENEWABLE_ENERGY_TYPES"
  | RenewableEnergyExpressCreationStep;

export type AllRenewableEnergyStep = PreCustomStep | RenewableEnergyCreationStep;

// Checks if a step belongs to the renewable energy flow (including pre-custom and express steps)
export const isRenewableEnergyCreationStep = (step: string): step is AllRenewableEnergyStep => {
  return (
    step === "RENEWABLE_ENERGY_CREATE_MODE_SELECTION" ||
    step === "RENEWABLE_ENERGY_TYPES" ||
    renewableEnergyCreationSteps.safeParse(step).success ||
    isRenewableEnergyExpressCreationStep(step)
  );
};
