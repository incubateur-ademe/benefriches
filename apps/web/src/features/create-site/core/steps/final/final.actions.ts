import {
  createCustomSiteDtoSchema,
  createExpressSiteDtoSchema,
  CreateExpressSiteDto,
} from "shared";
import z from "zod";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

const customSiteSchema = createCustomSiteDtoSchema;
export type CustomSitePayload = z.infer<typeof customSiteSchema>;

export interface CreateSiteGateway {
  saveCustom(siteData: CustomSitePayload): Promise<void>;
  saveExpress(siteData: CreateExpressSiteDto): Promise<void>;
}

export const customSiteSaved = createAppAsyncThunk(
  "siteCreation/customSiteSaved",
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();

    const siteToCreate: CustomSitePayload = customSiteSchema.parse({
      ...siteCreation.siteData,
      creationMode: "custom",
      createdBy: currentUser.currentUser?.id,
    });

    await extra.createSiteService.saveCustom(siteToCreate);
  },
);

export const expressSiteSaved = createAppAsyncThunk(
  "siteCreation/expressSiteSaved",
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();
    const { siteData } = siteCreation;

    if (!currentUser.currentUser) {
      throw new Error("Current user is missing");
    }

    const siteToCreate: CreateExpressSiteDto = createExpressSiteDtoSchema.parse({
      ...siteData,
      activity: siteData.agriculturalOperationActivity,
      type: siteData.naturalAreaType,
      createdBy: currentUser.currentUser.id,
    });

    await extra.createSiteService.saveExpress(siteToCreate);
  },
);
