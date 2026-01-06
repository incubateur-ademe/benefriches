import {
  addressSchema,
  createReconversionProjectSchema,
  ReconversionProjectUpdatePropsDto,
  siteNatureSchema,
  soilTypeSchema,
} from "shared";
import z from "zod";

import { siteOwnerSchema, siteTenantSchema } from "@/shared/core/stakeholder";

const siteViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: siteNatureSchema,
  isExpressSite: z.boolean(),
  owner: siteOwnerSchema,
  tenant: siteTenantSchema.optional(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  soilsDistribution: z.partialRecord(soilTypeSchema, z.number().nonnegative()),
  surfaceArea: z.number().nonnegative(),
  address: addressSchema,
});

export const reconversionProjectSchemaUpdateView = z.object({
  projectData: createReconversionProjectSchema(z.string()),
  siteData: siteViewSchema,
});

export type UpdateProjectSavePayload = ReconversionProjectUpdatePropsDto;
export type UpdateProjectView = z.infer<typeof reconversionProjectSchemaUpdateView>;
export interface UpdateProjectServiceGateway {
  getById(projectId: string): Promise<UpdateProjectView | undefined>;
  save(projectId: string, payload: UpdateProjectSavePayload): Promise<void>;
}
