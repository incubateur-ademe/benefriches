import { soilTypeSchema } from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

const scheduleSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

const costSchema = z.object({ amount: z.number().nonnegative(), purpose: z.string() });
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
    costs: costSchema.array(),
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
  realEstateTransactionSellingPrice: z.number().nonnegative().optional(),
  realEstateTransactionPropertyTransferDuties: z.number().nonnegative().optional(),
  reinstatementCosts: costSchema.array().optional(),
  financialAssistanceRevenues: revenueSchema.array(),
  yearlyProjectedCosts: costSchema.array(),
  yearlyProjectedRevenues: revenueSchema.array(),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().nonnegative().optional(),
  projectPhase: z.string(),
  projectPhaseDetails: z.string().optional(),
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
      reinstatementCosts: projectData.reinstatementCosts,
      realEstateTransactionSellingPrice: projectData.realEstateTransactionSellingPrice,
      realEstateTransactionPropertyTransferDuties:
        projectData.realEstateTransactionPropertyTransferDuties,
      financialAssistanceRevenues: projectData.financialAssistanceRevenues,
      yearlyProjectedCosts: projectData.yearlyProjectedCosts,
      yearlyProjectedRevenues: projectData.yearlyProjectedRevenues,
      soilsDistribution: projectData.soilsDistribution,
      reinstatementSchedule: projectData.reinstatementSchedule,
      operationsFirstYear: projectData.firstYearOfOperation,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: projectData.projectDeveloper,
        costs: projectData.photovoltaicPanelsInstallationCosts ?? [],
        installationSchedule: projectData.photovoltaicInstallationSchedule,
        features: {
          surfaceArea: projectData.photovoltaicInstallationSurfaceSquareMeters,
          electricalPowerKWc: projectData.photovoltaicInstallationElectricalPowerKWc,
          expectedAnnualProduction: projectData.photovoltaicExpectedAnnualProduction,
          contractDuration: projectData.photovoltaicContractDuration,
        },
      },
      projectPhase: projectData.projectPhase,
      projectPhaseDetails: projectData.projectPhaseDetails,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
