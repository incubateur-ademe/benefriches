import type { CreateExpressSiteDto } from "shared";
import { createExpressSiteDtoSchema } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { siteCreated } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import {
  customSiteSchema,
  type CustomSitePayload,
} from "@/features/create-site/core/createSiteGateway";
import { deriveSiteDataFromCustomSteps } from "@/features/create-site/core/custom/customSteps";

export const customSiteSaved = createAppAsyncThunk(
  "siteCreation/customSiteSaved",
  async (_, { getState, extra, dispatch }) => {
    const { siteCreation } = getState();
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
    });

    await extra.createSiteService.saveCustom(siteToCreate);
    void dispatch(eventTracked(siteCreated("custom")));
  },
);

export const expressSiteSaved = createAppAsyncThunk(
  "siteCreation/expressSiteSaved",
  async (_, { getState, extra, dispatch }) => {
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
    });

    await extra.createSiteService.saveExpress(siteToCreate);
    void dispatch(eventTracked(siteCreated("express")));
  },
);
