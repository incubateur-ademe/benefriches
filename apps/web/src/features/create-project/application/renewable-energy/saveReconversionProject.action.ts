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
  "projectCreation/renewableEnergyProject/save",
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { renewableEnergyProject, siteData, projectId } = projectCreation;
    const { creationData } = renewableEnergyProject;

    const mappedProjectData = {
      id: projectId,
      name: creationData.name,
      createdBy: currentUser.currentUser?.id,
      description: creationData.description,
      relatedSiteId: siteData?.id,
      futureOperator: creationData.futureOperator,
      futureSiteOwner: creationData.futureSiteOwner,
      conversionFullTimeJobsInvolved: creationData.conversionFullTimeJobsInvolved,
      reinstatementFullTimeJobsInvolved: creationData.reinstatementFullTimeJobsInvolved,
      reinstatementContractOwner: creationData.reinstatementContractOwner,
      operationsFullTimeJobsInvolved: creationData.operationsFullTimeJobsInvolved,
      reinstatementCosts: creationData.reinstatementExpenses,
      sitePurchaseSellingPrice: creationData.sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: creationData.sitePurchasePropertyTransferDuties,
      financialAssistanceRevenues: creationData.financialAssistanceRevenues,
      yearlyProjectedCosts: creationData.yearlyProjectedExpenses,
      yearlyProjectedRevenues: creationData.yearlyProjectedRevenues,
      soilsDistribution: creationData.soilsDistribution,
      reinstatementSchedule: creationData.reinstatementSchedule,
      operationsFirstYear: creationData.firstYearOfOperation,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: creationData.projectDeveloper,
        costs: creationData.photovoltaicPanelsInstallationExpenses ?? [],
        installationSchedule: creationData.photovoltaicInstallationSchedule,
        features: {
          surfaceArea: creationData.photovoltaicInstallationSurfaceSquareMeters,
          electricalPowerKWc: creationData.photovoltaicInstallationElectricalPowerKWc,
          expectedAnnualProduction: creationData.photovoltaicExpectedAnnualProduction,
          contractDuration: creationData.photovoltaicContractDuration,
        },
      },
      projectPhase: creationData.projectPhase,
      decontaminatedSoilSurface: creationData.decontaminatedSurfaceArea,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
