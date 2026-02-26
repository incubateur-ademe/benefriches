import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export const pageViewed = createAppAsyncThunk<void, { url: string }>(
  "analytics/pageViewed",
  ({ url }, { extra }) => {
    extra.analyticsService.trackPageView(url);
  },
);
