import { soilTypeSchema } from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";
import { sumList } from "@/shared/services/sum/sum";

const scheduleSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

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
    cost: z.number().nonnegative(),
    features: photovoltaicPowerStationFeaturesSchema,
    installationSchedule: scheduleSchema.optional(),
  }),
]);

const costSchema = z.object({ amount: z.number().nonnegative(), purpose: z.string() });

const saveProjectSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  developmentPlans: developmentPlanSchema.array().nonempty(),
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  realEstateTransactionSellingPrice: z.number().nonnegative().optional(),
  realEstateTransactionPropertyTransferDuties: z.number().nonnegative().optional(),
  reinstatementCosts: costSchema.array().optional(),
  reinstatementFinancialAssistanceAmount: z.number().nonnegative().optional(),
  yearlyProjectedCosts: costSchema.array(),
  yearlyProjectedRevenues: z
    .object({ amount: z.number().nonnegative(), source: z.string() })
    .array(),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().optional(),
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
      reinstatementCosts: projectData.reinstatementCosts?.costs,
      realEstateTransactionSellingPrice: projectData.realEstateTransactionSellingPrice,
      realEstateTransactionPropertyTransferDuties:
        projectData.realEstateTransactionPropertyTransferDuties,
      reinstatementFinancialAssistanceAmount: sumList(
        projectData.financialAssistanceRevenues?.map(({ amount }) => amount) ?? [],
      ),
      yearlyProjectedCosts: projectData.yearlyProjectedCosts,
      yearlyProjectedRevenues: projectData.yearlyProjectedRevenues,
      soilsDistribution: projectData.soilsDistribution,
      reinstatementSchedule: projectData.reinstatementSchedule,
      operationsFirstYear: projectData.firstYearOfOperation,
      developmentPlans: [
        {
          type: "PHOTOVOLTAIC_POWER_PLANT",
          developer: projectData.projectDeveloper,
          cost: projectData.photovoltaicPanelsInstallationCost,
          installationSchedule: projectData.photovoltaicInstallationSchedule,
          features: {
            surfaceArea: projectData.photovoltaicInstallationSurfaceSquareMeters,
            electricalPowerKWc: projectData.photovoltaicInstallationElectricalPowerKWc,
            expectedAnnualProduction: projectData.photovoltaicExpectedAnnualProduction,
            contractDuration: projectData.photovoltaicContractDuration,
          },
        },
      ],
      projectPhase: projectData.projectPhase,
      projectPhaseDetails: projectData.projectPhaseDetails,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
