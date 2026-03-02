import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const pageViewed = createAppAsyncThunk<void, { url: string }>(
  "analytics/pageViewed",
  ({ url }, { extra }) => {
    extra.analyticsService.trackPageView(url);
  },
);
