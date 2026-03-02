import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { SiteView } from "./site.types";

export const fetchSiteView = createAppAsyncThunk<SiteView, { siteId: string }>(
  "siteView/fetchSiteView",
  async ({ siteId }, { extra }) => {
    const data = await extra.siteService.getSiteView(siteId);

    return data;
  },
);
