import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import type { SiteFeatures } from "./site.types";

export const fetchSiteFeatures = createAppAsyncThunk<SiteFeatures, { siteId: string }>(
  "siteFeatures/fetchSiteFeatures",
  async ({ siteId }, { extra }) => {
    const data = await extra.siteService.getSiteFeatures(siteId);

    return data;
  },
);
