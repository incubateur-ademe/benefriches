import z from "zod";

import { DevelopmentPlanInstallationExpenses } from "../reconversion-project-impacts";
import { SoilsDistribution, soilTypeSchema } from "../soils";
import { FinancialAssistanceRevenue, ReinstatementExpense } from "./_common";
import { RecurringExpense, RecurringRevenue } from "./renewable-energy";
import { BuildingsUseDistribution, buildingsUseDistributionSchema } from "./urban-project";
import {
  LEGACY_SpacesDistribution,
  LEGACY_urbanProjectsSpaceSchema,
} from "./urban-project/urbanProject";

export const photovoltaicPowerStationFeaturesSchema = z.object({
  surfaceArea: z.number().nonnegative(),
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

export const urbanProjectsFeaturesSchema = z.object({
  spacesDistribution: LEGACY_urbanProjectsSpaceSchema,
  buildingsFloorAreaDistribution: buildingsUseDistributionSchema,
});

const expenseSchema = z.object({ purpose: z.string(), amount: z.number().nonnegative() });
const revenueSchema = z.object({ source: z.string(), amount: z.number().nonnegative() });

const developmentPlanType = z.enum(["PHOTOVOLTAIC_POWER_PLANT", "URBAN_PROJECT"]);

const spaceCategorySchema = z
  .enum(["PUBLIC_GREEN_SPACE", "PUBLIC_SPACE", "LIVING_AND_ACTIVITY_SPACE", "URBAN_POND_OR_LAKE"])
  .optional();

const coerceToDate = z.string().or(z.date()).pipe(z.coerce.date());
export function createReconversionProjectSchema<T extends z.ZodTypeAny>(dateSchema: T) {
  const scheduleSchema = z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  });

  const baseDevelopmentPlanSchema = z.object({
    type: developmentPlanType,
    developer: z.object({ name: z.string(), structureType: z.string() }),
    costs: expenseSchema.array(),
    installationSchedule: scheduleSchema.optional(),
  });

  const developmentPlanSchema = z.discriminatedUnion("type", [
    baseDevelopmentPlanSchema.extend({
      type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
      features: photovoltaicPowerStationFeaturesSchema,
    }),
    baseDevelopmentPlanSchema.extend({
      type: z.literal("URBAN_PROJECT"),
      features: urbanProjectsFeaturesSchema,
    }),
  ]);

  return z.object({
    id: z.uuid(),
    createdBy: z.uuid(),
    createdAt: dateSchema,
    updatedAt: dateSchema.optional(),
    creationMode: z.enum(["express", "custom", "duplicated"]),
    name: z.string(),
    description: z.string().optional(),
    relatedSiteId: z.uuid(),
    developmentPlan: developmentPlanSchema,
    decontaminatedSoilSurface: z.number().nonnegative().optional(),
    futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
    futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
    reinstatementContractOwner: z
      .object({ name: z.string(), structureType: z.string() })
      .optional(),
    sitePurchaseSellingPrice: z.number().nonnegative().optional(),
    sitePurchasePropertyTransferDuties: z.number().nonnegative().optional(),
    reinstatementCosts: z.array(expenseSchema).optional(),
    financialAssistanceRevenues: z.array(revenueSchema).optional(),
    yearlyProjectedCosts: z.array(expenseSchema),
    yearlyProjectedRevenues: z.array(revenueSchema),
    soilsDistribution: z.array(
      z.object({
        soilType: soilTypeSchema,
        spaceCategory: spaceCategorySchema,
        surfaceArea: z.number().nonnegative(),
      }),
    ),
    reinstatementSchedule: scheduleSchema.optional(),
    operationsFirstYear: z.number().int().min(2000).optional(),
    projectPhase: z.string(),
    siteResaleExpectedSellingPrice: z.number().nonnegative().optional(),
    siteResaleExpectedPropertyTransferDuties: z.number().nonnegative().optional(),
    buildingsResaleExpectedSellingPrice: z.number().nonnegative().optional(),
    buildingsResaleExpectedPropertyTransferDuties: z.number().nonnegative().optional(),
  });
}

export const reconversionProjectSchema = createReconversionProjectSchema(coerceToDate);

export type SpaceCategory = z.infer<typeof spaceCategorySchema>;

export type ReconversionProjectDataView = z.infer<typeof reconversionProjectSchema>;
export type ReconversionProjectSoilsDistribution = ReconversionProjectDataView["soilsDistribution"];

export const saveReconversionProjectSchema = reconversionProjectSchema;
export const saveReconversionProjectPropsSchema = saveReconversionProjectSchema.omit({
  createdAt: true,
  updatedAt: true,
  creationMode: true,
});
export type ReconversionProjectSaveDto = z.infer<typeof saveReconversionProjectSchema>;
export type ReconversionProjectSavePropsDto = z.infer<typeof saveReconversionProjectPropsSchema>;

export const updateReconversionProjectSchema = reconversionProjectSchema.omit({
  createdAt: true,
  creationMode: true,
  createdBy: true,
  relatedSiteId: true,
});
export const updateReconversionProjectPropsSchema = updateReconversionProjectSchema.omit({
  id: true,
  updatedAt: true,
});
export type ReconversionProjectUpdateDto = z.infer<typeof updateReconversionProjectSchema>;
export type ReconversionProjectUpdatePropsDto = z.infer<
  typeof updateReconversionProjectPropsSchema
>;

type ScheduleString = {
  startDate: string;
  endDate: string;
};
export type BaseReconversionProjectFeaturesView<T_Schedule = ScheduleString> = {
  id: string;
  name: string;
  description?: string;
  isExpress: boolean;
  developmentPlan:
    | {
        type: "PHOTOVOLTAIC_POWER_PLANT";
        electricalPowerKWc: number;
        surfaceArea: number;
        expectedAnnualProduction: number;
        contractDuration: number;
        installationCosts: DevelopmentPlanInstallationExpenses[];
        installationSchedule?: T_Schedule;
        developerName?: string;
      }
    | {
        type: "URBAN_PROJECT";
        developerName?: string;
        spacesDistribution: LEGACY_SpacesDistribution;
        buildingsFloorAreaDistribution: BuildingsUseDistribution;
        installationCosts: DevelopmentPlanInstallationExpenses[];
        installationSchedule?: T_Schedule;
      };
  soilsDistribution: SoilsDistribution;
  futureOwner?: string;
  futureOperator?: string;
  reinstatementContractOwner?: string;
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementCosts?: ReinstatementExpense[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  reinstatementSchedule?: T_Schedule;
  firstYearOfOperation?: number;
  sitePurchaseTotalAmount?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  decontaminatedSoilSurface?: number;
};
