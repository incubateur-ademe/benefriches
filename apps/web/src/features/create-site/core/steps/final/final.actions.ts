import { createExpressSiteDtoSchema, CreateExpressSiteDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import {
  customSiteSchema,
  type CustomSitePayload,
} from "@/features/create-site/core/createSiteGateway";

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
