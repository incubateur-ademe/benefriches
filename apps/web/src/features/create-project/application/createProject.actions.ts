import { z } from "zod";
import {
  PhotovoltaicKeyParameter,
  ProjectSite,
  renewableEnergyProductionDevelopmentPlanTypeSchema,
} from "../domain/project.types";

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

const saveProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  renewableEnergyTypes: renewableEnergyProductionDevelopmentPlanTypeSchema.array().nonempty(),
  photovoltaicKeyParameter: z.nativeEnum(PhotovoltaicKeyParameter),
  photovoltaicInstallationElectricalPowerKWc: z.number().nonnegative(),
  photovoltaicInstallationSurfaceSquareMeters: z.number().nonnegative(),
  photovoltaicExpectedAnnualProduction: z.number().nonnegative(),
  photovoltaicContractDuration: z.number().nonnegative(),
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementCost: z.number().nonnegative().optional(),
  photovoltaicPanelsInstallationCost: z.number().nonnegative(),
  reinstatementFinancialAssistanceAmount: z.number().nonnegative().optional(),
  yearlyProjectedCosts: z.object({ amount: z.number().nonnegative() }).array(),
  yearlyProjectedRevenues: z.object({ amount: z.number().nonnegative() }).array(),
  soilsDistribution: z.record(z.nativeEnum(SoilType), z.number().nonnegative()),
  reinstatementSchedule: z
    .object({
      startDate: z.string().pipe(z.coerce.date()).optional(),
      endDate: z.string().pipe(z.coerce.date()).optional(),
    })
    .optional(),
  photovoltaicInstallationSchedule: z
    .object({
      startDate: z.string().pipe(z.coerce.date()).optional(),
      endDate: z.string().pipe(z.coerce.date()).optional(),
    })
    .optional(),
  firstYearOfOperation: z.string().optional(),
});

export type SaveProjectPayload = z.infer<typeof saveProjectSchema>;

export interface SaveProjectGateway {
  save(siteData: SaveProjectPayload): Promise<void>;
}

export const saveProjectAction = createAppAsyncThunk(
  "project/save",
  async (_, { getState, extra }) => {
    const { projectCreation } = getState();

    const projectToSave = saveProjectSchema.parse({
      ...projectCreation.projectData,
      relatedSiteId: projectCreation.siteData?.id,
    });

    await extra.saveProjectGateway.save(projectToSave);
  },
);
