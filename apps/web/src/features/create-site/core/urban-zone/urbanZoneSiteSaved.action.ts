import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { siteCreated } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import {
  customSiteSchema,
  type CustomSitePayload,
} from "@/features/create-site/core/createSiteGateway";

import { deriveSiteDataFromCustomSteps } from "../custom/customSteps";
import { buildUrbanZoneSiteDataForSave } from "./buildUrbanZoneSitePayload";
import { makeUrbanZoneActionType } from "./urban-zone.actions";

export const urbanZoneSiteSaved = createAppAsyncThunk(
  makeUrbanZoneActionType("saved"),
  async (_, { getState, extra, dispatch }) => {
    const { siteCreation } = getState();
    const { urbanZone } = siteCreation;
    const siteData = deriveSiteDataFromCustomSteps(
      {
        ...siteCreation.initialSiteData,
        isFriche: siteCreation.isFriche,
        nature: siteCreation.nature,
      },
      siteCreation.custom.steps,
    );

    const siteToCreate: CustomSitePayload = customSiteSchema.parse(
      buildUrbanZoneSiteDataForSave(siteData, urbanZone.steps),
    );

    await extra.createSiteService.saveCustom(siteToCreate);
    void dispatch(eventTracked(siteCreated("custom")));
  },
);
