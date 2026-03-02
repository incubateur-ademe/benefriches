import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export type AnalyticsEvent = {
  category: string;
  action: string;
  name?: string;
  value?: number;
};

export const eventTracked = createAppAsyncThunk<void, AnalyticsEvent>(
  "analytics/eventTracked",
  (event, { extra }) => {
    extra.analyticsService.trackEvent(event);
  },
);
