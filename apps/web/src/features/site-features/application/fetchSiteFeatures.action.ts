import { SiteFeatures } from "../domain/siteFeatures";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface SiteFeaturesGateway {
  getSiteFeatures(siteId: string): Promise<SiteFeatures>;
}

export const fetchSiteFeatures = createAppAsyncThunk<SiteFeatures, { siteId: string }>(
  "siteFeatures/fetchSiteFeatures",
  async ({ siteId }, { extra }) => {
    const data = await extra.siteFeaturesService.getSiteFeatures(siteId);

    return data;
  },
);
