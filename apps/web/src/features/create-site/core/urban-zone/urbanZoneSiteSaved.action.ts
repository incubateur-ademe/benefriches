import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import {
  customSiteSchema,
  type CustomSitePayload,
} from "@/features/create-site/core/createSiteGateway";

import { deriveSiteDataFromCustomSteps } from "../custom/customSteps";
import { buildUrbanZoneSiteDataForSave } from "./buildUrbanZoneSitePayload";
import { makeUrbanZoneActionType } from "./urban-zone.actions";

export const urbanZoneSiteSaved = createAppAsyncThunk(
  makeUrbanZoneActionType("saved"),
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();
    const { urbanZone } = siteCreation;
    const siteData = deriveSiteDataFromCustomSteps(
      {
        ...siteCreation.initialSiteData,
        isFriche: siteCreation.isFriche,
        nature: siteCreation.nature,
      },
      siteCreation.custom.steps,
    );

    const siteToCreate: CustomSitePayload = customSiteSchema.parse({
      createdBy: currentUser.currentUser?.id,
      ...buildUrbanZoneSiteDataForSave(siteData, urbanZone.steps),
    });

    await extra.createSiteService.saveCustom(siteToCreate);
  },
);
