import { z } from "zod";
import {
  PhotovoltaicKeyParameter,
  ProjectSite,
  ProjectType,
  RenewableEnergyType,
} from "../domain/project.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";
import { SoilType } from "@/features/create-site/domain/siteFoncier.types";

export interface GetSiteGateway {
  getById(siteId: string): Promise<ProjectSite | undefined>;
}

export const fetchRelatedSiteAction = createAppAsyncThunk<
  ProjectSite,
  ProjectSite["id"]
>("project/fetchRelatedSite", async (siteId, { extra }) => {
  const projectSite = await extra.getSiteService.getById(siteId);

  if (!projectSite) throw new Error("Site not found");

  return projectSite;
});

const saveProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  types: z.nativeEnum(ProjectType).array().nonempty(),
  renewableEnergyTypes: z.nativeEnum(RenewableEnergyType).array().nonempty(),
  photovoltaicKeyParameter: z.nativeEnum(PhotovoltaicKeyParameter),
  photovoltaicInstallationElectricalPowerKWc: z.number().nonnegative(),
  photovoltaicInstallationSurfaceSquareMeters: z.number().nonnegative(),
  photovoltaicExpectedAnnualProduction: z.number().nonnegative(),
  photovoltaicContractDuration: z.number().nonnegative(),
  futureOperator: z
    .object({ name: z.string(), structureType: z.string() })
    .optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z
    .object({ name: z.string(), structureType: z.string() })
    .optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementCost: z.number().nonnegative().optional(),
  photovoltaicPanelsInstallationCost: z.number().nonnegative(),
  financialAssistanceRevenue: z.number().nonnegative(),
  yearlyProjectedCosts: z.object({ amount: z.number().nonnegative() }).array(),
  yearlyProjectedRevenue: z
    .object({ amount: z.number().nonnegative() })
    .array(),
  soilsSurfaceAreas: z.record(z.nativeEnum(SoilType), z.number().nonnegative()),
});

type SaveProjectPayload = z.infer<typeof saveProjectSchema>;

export type SaveProjectGatewayPayload = SaveProjectPayload;

export interface SaveProjectGateway {
  save(siteData: SaveProjectGatewayPayload): Promise<void>;
}

export const saveProjectAction = createAppAsyncThunk<void>(
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
