import type { CreateExpressSiteDto } from "shared";
import { createCustomSiteDtoSchema } from "shared";
import type z from "zod";

const customSiteSchema = createCustomSiteDtoSchema;

export type CustomSitePayload = z.infer<typeof customSiteSchema>;

export interface CreateSiteGateway {
  saveCustom(siteData: CustomSitePayload): Promise<void>;
  saveExpress(siteData: CreateExpressSiteDto): Promise<void>;
}

export { customSiteSchema };
