import { createExpressSiteDtoSchema, CreateExpressSiteDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import {
  customSiteSchema,
  type CustomSitePayload,
} from "@/features/create-site/core/createSiteGateway";
import { deriveSiteDataFromCustomSteps } from "@/features/create-site/core/custom/customSteps";

export const customSiteSaved = createAppAsyncThunk(
  "siteCreation/customSiteSaved",
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();
    const siteData = deriveSiteDataFromCustomSteps(
      {
        ...siteCreation.initialSiteData,
        isFriche: siteCreation.isFriche,
        nature: siteCreation.nature,
      },
      siteCreation.custom.steps,
    );

    const siteToCreate: CustomSitePayload = customSiteSchema.parse({
      ...siteData,
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
    const siteData = deriveSiteDataFromCustomSteps(
      {
        ...siteCreation.initialSiteData,
        isFriche: siteCreation.isFriche,
        nature: siteCreation.nature,
      },
      siteCreation.custom.steps,
    );

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
