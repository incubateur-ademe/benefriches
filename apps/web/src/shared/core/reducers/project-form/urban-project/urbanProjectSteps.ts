import {
  createReconversionProjectSchema,
  financialAssistanceRevenueSourceSchema,
  reinstatementExpensesPurposeSchema,
  soilTypeSchema,
  typedObjectKeys,
  urbanProjectBuildingsUseSchema,
  urbanProjectDevelopmentExpensePurposeSchema,
  urbanProjectTemplateSchema,
  urbanProjectUseSchema,
  yearlyBuildingsOperationsExpensePurposeSchema,
  yearlyBuildingsOperationsRevenuePurposeSchema,
} from "shared";
import z from "zod";

export const INTRODUCTION_STEPS = [
  "URBAN_PROJECT_USES_INTRODUCTION",
  "URBAN_PROJECT_SPACES_INTRODUCTION",
  "URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION",
  "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
  "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
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

const projectStakeholderSchema = z.object({
  name: z.string(),
  structureType: z.enum([
    "unknown",
    "company",
    "private_individual",
    "municipality",
    "epci",
    "department",
    "region",
    "local_authority",
  ]),
});

export const answersByStepSchemas = {
  // Common
  URBAN_PROJECT_CREATE_MODE_SELECTION: z.object({
    createMode: z.enum(["custom", "express"]),
  }),

  // Express
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: z.object({
    projectTemplate: urbanProjectTemplateSchema,
  }),

  // Custom - uses
  URBAN_PROJECT_USES_SELECTION: z.object({
    usesSelection: z.array(urbanProjectUseSchema),
  }),

  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: z.object({
    publicGreenSpacesSurfaceArea: z.number(),
  }),

  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: z.object({
    publicGreenSpacesSoilsDistribution: z.partialRecord(soilTypeSchema, z.number()),
  }),

  // Custom - spaces
  URBAN_PROJECT_SPACES_SELECTION: z.object({
    spacesSelection: z.array(soilTypeSchema),
  }),

  URBAN_PROJECT_SPACES_SURFACE_AREA: z.object({
    spacesSurfaceAreaDistribution: z.partialRecord(soilTypeSchema, z.number()),
  }),

  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: z.object({
    decontaminationPlan: z.enum(["partial", "none", "unknown"]),
  }),

  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: z.object({
    decontaminatedSurfaceArea: z.number(),
  }),

  // custom - buildings
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: z.object({
    usesFloorSurfaceAreaDistribution: z.partialRecord(urbanProjectBuildingsUseSchema, z.number()),
  }),

  // custom - stakeholders
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: z.object({
    projectDeveloper: projectStakeholderSchema,
  }),

  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: z.object({
    reinstatementContractOwner: projectStakeholderSchema,
  }),

  URBAN_PROJECT_SITE_RESALE_SELECTION: z.object({
    siteResaleSelection: z.enum(["yes", "no", "unknown"]),
  }),

  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: z.object({
    buildingsResalePlannedAfterDevelopment: z.boolean(),
    futureOperator: projectStakeholderSchema.optional(),
  }),

  // Custom - expenses
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: z.object({
    sitePurchaseSellingPrice: z.number().optional(),
    sitePurchasePropertyTransferDuties: z.number().optional(),
  }),

  URBAN_PROJECT_EXPENSES_REINSTATEMENT: z.object({
    reinstatementExpenses: z.array(
      z.object({
        amount: z.number().nonnegative(),
        purpose: reinstatementExpensesPurposeSchema,
      }),
    ),
  }),

  URBAN_PROJECT_EXPENSES_INSTALLATION: z.object({
    installationExpenses: z.array(
      z.object({
        amount: z.number().nonnegative(),
        purpose: urbanProjectDevelopmentExpensePurposeSchema,
      }),
    ),
  }),

  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: z.object({
    yearlyProjectedBuildingsOperationsExpenses: z.array(
      z.object({
        amount: z.number().nonnegative(),
        purpose: yearlyBuildingsOperationsExpensePurposeSchema,
      }),
    ),
  }),

  // custom - revenues
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: z.object({
    siteResaleExpectedSellingPrice: z.number().optional(),
    siteResaleExpectedPropertyTransferDuties: z.number().optional(),
  }),

  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: z.object({
    buildingsResaleSellingPrice: z.number().optional(),
    buildingsResalePropertyTransferDuties: z.number().optional(),
  }),

  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: z.object({
    yearlyProjectedRevenues: z.array(
      z.object({
        amount: z.number().nonnegative(),
        source: yearlyBuildingsOperationsRevenuePurposeSchema,
      }),
    ),
  }),

  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: z.object({
    financialAssistanceRevenues: z.array(
      z.object({
        amount: z.number().nonnegative(),
        source: financialAssistanceRevenueSourceSchema,
      }),
    ),
  }),

  // custom - schedule, naming, phase
  URBAN_PROJECT_SCHEDULE_PROJECTION: z.object({
    reinstatementSchedule: z
      .object({
        startDate: z.string(),
        endDate: z.string(),
      })
      .optional(),
    installationSchedule: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    firstYearOfOperation: z.number(),
  }),

  URBAN_PROJECT_NAMING: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),

  URBAN_PROJECT_PROJECT_PHASE: z.object({
    projectPhase: z.string().optional(),
  }),
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
