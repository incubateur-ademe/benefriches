import { LOCAL_AUTHORITIES } from "shared";
import z from "zod";

const siteStakeholdersStructureTypeSchema = z.enum([
  "company",
  "private_individual",
  ...LOCAL_AUTHORITIES,
]);
export const siteOwnerSchema = z.object({
  name: z.string(),
  structureType: siteStakeholdersStructureTypeSchema,
});
export const siteTenantSchema = z.object({
  name: z.string(),
  structureType: siteStakeholdersStructureTypeSchema,
});

type Owner = z.infer<typeof siteOwnerSchema>;
type Tenant = z.infer<typeof siteTenantSchema>;
export type OwnerStructureType = Owner["structureType"];
export type TenantStructureType = Tenant["structureType"];
export type SiteStakeholderStructureType = z.infer<typeof siteStakeholdersStructureTypeSchema>;
