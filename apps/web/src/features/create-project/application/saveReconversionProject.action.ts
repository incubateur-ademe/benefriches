import { soilTypeSchema } from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

const scheduleSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

const expenseSchema = z.object({ amount: z.number().nonnegative(), purpose: z.string() });
const revenueSchema = z.object({ amount: z.number().nonnegative(), source: z.string() });

const photovoltaicPowerStationFeaturesSchema = z.object({
  surfaceArea: z.number().nonnegative(),
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

const developmentPlanSchema = z.discriminatedUnion("type", [
  z.object({
    developer: z.object({ name: z.string(), structureType: z.string() }),
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    costs: expenseSchema.array(),
    features: photovoltaicPowerStationFeaturesSchema,
    installationSchedule: scheduleSchema.optional(),
  }),
]);

const saveProjectSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  developmentPlan: developmentPlanSchema,
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  sitePurchaseSellingPrice: z.number().nonnegative().optional(),
  sitePurchasePropertyTransferDuties: z.number().nonnegative().optional(),
  reinstatementCosts: expenseSchema.array().optional(),
  financialAssistanceRevenues: revenueSchema.array(),
  yearlyProjectedCosts: expenseSchema.array(),
  yearlyProjectedRevenues: revenueSchema.array(),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().nonnegative().optional(),
  projectPhase: z.string(),
  decontaminatedSoilSurface: z.number().optional(),
});

export type SaveProjectPayload = z.infer<typeof saveProjectSchema>;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}

export const saveReconversionProject = createAppAsyncThunk(
  "projectCreation/save",
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { projectData, siteData } = projectCreation;

    const mappedProjectData = {
      id: projectData.id,
      name: projectData.name,
      createdBy: currentUser.currentUser?.id,
      description: projectData.description,
      relatedSiteId: siteData?.id,
      futureOperator: projectData.futureOperator,
      futureSiteOwner: projectData.futureSiteOwner,
      conversionFullTimeJobsInvolved: projectData.conversionFullTimeJobsInvolved,
      reinstatementFullTimeJobsInvolved: projectData.reinstatementFullTimeJobsInvolved,
      reinstatementContractOwner: projectData.reinstatementContractOwner,
      operationsFullTimeJobsInvolved: projectData.operationsFullTimeJobsInvolved,
      reinstatementCosts: projectData.reinstatementExpenses,
      sitePurchaseSellingPrice: projectData.sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: projectData.sitePurchasePropertyTransferDuties,
      financialAssistanceRevenues: projectData.financialAssistanceRevenues,
      yearlyProjectedCosts: projectData.yearlyProjectedExpenses,
      yearlyProjectedRevenues: projectData.yearlyProjectedRevenues,
      soilsDistribution: projectData.soilsDistribution,
      reinstatementSchedule: projectData.reinstatementSchedule,
      operationsFirstYear: projectData.firstYearOfOperation,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: projectData.projectDeveloper,
        costs: projectData.photovoltaicPanelsInstallationExpenses ?? [],
        installationSchedule: projectData.photovoltaicInstallationSchedule,
        features: {
          surfaceArea: projectData.photovoltaicInstallationSurfaceSquareMeters,
          electricalPowerKWc: projectData.photovoltaicInstallationElectricalPowerKWc,
          expectedAnnualProduction: projectData.photovoltaicExpectedAnnualProduction,
          contractDuration: projectData.photovoltaicContractDuration,
        },
      },
      projectPhase: projectData.projectPhase,
      decontaminatedSoilSurface: projectData.decontaminatedSurfaceArea,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
