import { createCustomSiteDtoSchema, CreateExpressSiteDto } from "shared";
import z from "zod";

const customSiteSchema = createCustomSiteDtoSchema;

export type CustomSitePayload = z.infer<typeof customSiteSchema>;

export interface CreateSiteGateway {
  saveCustom(siteData: CustomSitePayload): Promise<void>;
  saveExpress(siteData: CreateExpressSiteDto): Promise<void>;
}

export { customSiteSchema };
