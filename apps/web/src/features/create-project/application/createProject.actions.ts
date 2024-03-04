import { z } from "zod";
import { ProjectSite } from "../domain/project.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";
import { SoilType } from "@/shared/domain/soils";

export interface GetSitesByIdGateway {
  getById(siteId: string): Promise<ProjectSite | undefined>;
}

export const fetchRelatedSiteAction = createAppAsyncThunk<ProjectSite, ProjectSite["id"]>(
  "project/fetchRelatedSite",
  async (siteId, { extra }) => {
    const projectSite = await extra.getSiteByIdService.getById(siteId);

    if (!projectSite) throw new Error("Site not found");

    return projectSite;
  },
);

const scheduleSchema = z.object({
  startDate: z.string().pipe(z.coerce.date()),
  endDate: z.string().pipe(z.coerce.date()),
});

const photovoltaicPowerStationFeaturesSchema = z.object({
  surfaceArea: z.number().nonnegative(),
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

const developmentPlanSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    cost: z.number().nonnegative(),
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
  developmentPlans: developmentPlanSchema.array().nonempty(),
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  realEstateTransactionCost: z.number().nonnegative().optional(),
  reinstatementCost: z.number().nonnegative().optional(),
  reinstatementFinancialAssistanceAmount: z.number().nonnegative().optional(),
  yearlyProjectedCosts: z.object({ amount: z.number().nonnegative(), purpose: z.string() }).array(),
  yearlyProjectedRevenues: z
    .object({ amount: z.number().nonnegative(), source: z.string() })
    .array(),
  soilsDistribution: z.record(z.nativeEnum(SoilType), z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().optional(),
});

export type SaveProjectPayload = z.infer<typeof saveProjectSchema>;

export interface SaveReconversionProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}

export const saveProjectAction = createAppAsyncThunk(
  "project/save",
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
      reinstatementCost: projectData.reinstatementCost,
      realEstateTransactionCost: projectData.realEstateTransactionCost,
      reinstatementFinancialAssistanceAmount: projectData.reinstatementFinancialAssistanceAmount,
      yearlyProjectedCosts: projectData.yearlyProjectedCosts,
      yearlyProjectedRevenues: projectData.yearlyProjectedRevenues,
      soilsDistribution: projectData.soilsDistribution,
      reinstatementSchedule: projectData.reinstatementSchedule,
      operationsFirstYear: projectData.firstYearOfOperation,
      developmentPlans: [
        {
          type: "PHOTOVOLTAIC_POWER_PLANT",
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
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
