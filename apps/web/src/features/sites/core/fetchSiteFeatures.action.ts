import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { SiteFeatures, SiteView } from "./site.types";

export interface SiteGateway {
  getSiteFeatures(siteId: string): Promise<SiteFeatures>;
  getSiteView(siteId: string): Promise<SiteView>;
}

export const fetchSiteFeatures = createAppAsyncThunk<SiteFeatures, { siteId: string }>(
  "siteFeatures/fetchSiteFeatures",
  async ({ siteId }, { extra }) => {
    const data = await extra.siteService.getSiteFeatures(siteId);

    return data;
  },
);
