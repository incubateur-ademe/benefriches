import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { SiteView } from "./site.types";

export const fetchSiteView = createAppAsyncThunk<
  SiteView,
  { siteId: string },
  { rejectValue: "notFound" }
>("siteView/fetchSiteView", async ({ siteId }, { extra, rejectWithValue }) => {
  const data = await extra.siteService.getSiteView(siteId);

  if (!data) return rejectWithValue("notFound");

  return data;
});
