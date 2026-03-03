import { reinstatementExpensesPurposeSchema, soilTypeSchema, typedObjectKeys } from "shared";
import type { SoilsDistribution, SoilType } from "shared";
import z from "zod";

import { projectStakeholderSchema } from "./step-handlers/shared/projectStakeholder.schema";

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

const soilsDistributionSchema: z.ZodType<SoilsDistribution> = z.record(soilTypeSchema, z.number());
const soilTypeArraySchema: z.ZodType<SoilType[]> = z.array(soilTypeSchema);
const soilsTransformationProjectSchema = z.enum(["renaturation", "preserveCurrentSoils", "custom"]);

export const answersByStepSchemas = {
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: z.object({
    photovoltaicKeyParameter: z.enum(["POWER", "SURFACE"]),
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: z.object({
    photovoltaicInstallationElectricalPowerKWc: z.number(),
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: z.object({
    photovoltaicInstallationSurfaceSquareMeters: z.number(),
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: z.object({
    photovoltaicExpectedAnnualProduction: z.number(),
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION: z.object({
    photovoltaicContractDuration: z.number(),
  }),
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: z.object({
    decontaminationPlan: z.enum(["partial", "none", "unknown"]),
    decontaminatedSurfaceArea: z.number().optional(),
  }),
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA: z.object({
    decontaminatedSurfaceArea: z.number(),
  }),
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: z.object({
    nonSuitableSoilsToTransform: soilTypeArraySchema,
  }),
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: z.object({
    nonSuitableSoilsSurfaceAreaToTransform: soilsDistributionSchema,
    baseSoilsDistributionForTransformation: soilsDistributionSchema.optional(),
  }),
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: z.object({
    soilsTransformationProject: soilsTransformationProjectSchema,
    soilsDistribution: soilsDistributionSchema.optional(),
  }),
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: z.object({
    futureSoilsSelection: soilTypeArraySchema,
  }),
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION: z.object({
    soilsDistribution: soilsDistributionSchema,
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: z.object({
    projectDeveloper: projectStakeholderSchema,
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: z.object({
    futureOperator: projectStakeholderSchema,
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: z.object({
    reinstatementContractOwner: projectStakeholderSchema,
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: z.object({
    willSiteBePurchased: z.boolean(),
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: z.object({
    futureSiteOwner: projectStakeholderSchema,
  }),
  RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: z.object({
    sellingPrice: z.number(),
    propertyTransferDuties: z.number().optional(),
  }),
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: z.object({
    reinstatementExpenses: z.array(
      z.object({ amount: z.number(), purpose: reinstatementExpensesPurposeSchema }),
    ),
  }),
  RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: z.object({
    photovoltaicPanelsInstallationExpenses: z.array(
      z.object({ amount: z.number(), purpose: z.string() }),
    ),
  }),
  RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: z.object({
    yearlyProjectedExpenses: z.array(z.object({ amount: z.number(), purpose: z.string() })),
  }),
  RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE: z.object({
    yearlyProjectedRevenues: z.array(z.object({ amount: z.number(), source: z.string() })),
  }),
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: z.object({
    financialAssistanceRevenues: z.array(z.object({ amount: z.number(), source: z.string() })),
  }),
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: z.object({
    firstYearOfOperation: z.number().optional(),
    photovoltaicInstallationSchedule: z
      .object({ startDate: z.string(), endDate: z.string() })
      .optional(),
    reinstatementSchedule: z.object({ startDate: z.string(), endDate: z.string() }).optional(),
  }),
  RENEWABLE_ENERGY_PROJECT_PHASE: z.object({
    phase: z.string(),
  }),
  RENEWABLE_ENERGY_NAMING: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
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
const renewableEnergyExpressCreationStep = z.enum([
  "RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY",
  "RENEWABLE_ENERGY_CREATION_RESULT",
]);

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
