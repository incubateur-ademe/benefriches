import { API_ROUTES } from "shared";
import z from "zod";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

const customSiteSchema = API_ROUTES.SITES.CREATE_CUSTOM_SITE.bodySchema;
export type CustomSitePayload = z.infer<typeof customSiteSchema>;

const expressSiteSchema = API_ROUTES.SITES.CREATE_EXPRESS_SITE.bodySchema;
export type ExpressSitePayload = z.infer<typeof expressSiteSchema>;

export interface CreateSiteGateway {
  saveCustom(siteData: CustomSitePayload): Promise<void>;
  saveExpress(siteData: ExpressSitePayload): Promise<void>;
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

    const siteToCreate: ExpressSitePayload = expressSiteSchema.parse({
      ...siteData,
      activity: siteData.agriculturalOperationActivity,
      type: siteData.naturalAreaType,
      createdBy: currentUser.currentUser.id,
    });

    await extra.createSiteService.saveExpress(siteToCreate);
  },
);
