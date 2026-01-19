import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

type EstimatedSiteResalePrice = {
  sellingPrice: number;
  propertyTransferDuties: number;
};

export const fetchEstimatedSiteResalePrice = createAppAsyncThunk<EstimatedSiteResalePrice>(
  makeUrbanProjectCreationActionType("fetchEstimatedSiteResalePrice"),
  async (_, { getState, extra }) => {
    const { projectCreation } = getState();
    const siteId = projectCreation.siteData?.id;

    if (!siteId) {
      throw new Error("Site ID is required");
    }

    return extra.realEstateValuationService.getEstimatedSiteResalePrice(siteId);
  },
);
