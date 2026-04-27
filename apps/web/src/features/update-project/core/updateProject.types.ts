import {
  addressSchema,
  createReconversionProjectSchema,
  ReconversionProjectUpdatePropsDto,
  siteNatureSchema,
  soilTypeSchema,
  surfaceAreaSchema,
  siteOwnerSchema,
  siteTenantSchema,
} from "shared";
import z from "zod";

const siteViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: siteNatureSchema,
  isExpressSite: z.boolean(),
  owner: siteOwnerSchema,
  tenant: siteTenantSchema.optional(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: surfaceAreaSchema.optional(),
  soilsDistribution: z.partialRecord(soilTypeSchema, surfaceAreaSchema),
  surfaceArea: surfaceAreaSchema,
  address: addressSchema,
});

export const reconversionProjectSchemaUpdateView = z.object({
  projectData: createReconversionProjectSchema(z.string()).omit({ status: true }),
  siteData: siteViewSchema,
});

export type UpdateProjectSavePayload = ReconversionProjectUpdatePropsDto;
export type UpdateProjectView = z.infer<typeof reconversionProjectSchemaUpdateView>;
export interface UpdateProjectServiceGateway {
  getById(projectId: string): Promise<UpdateProjectView | undefined>;
  save(projectId: string, payload: UpdateProjectSavePayload): Promise<void>;
}
