export type AnalyticsGateway = {
  init(): void;
  trackPageView(url: string): void;
  trackEvent(event: { category: string; action: string; name?: string; value?: number }): void;
};
