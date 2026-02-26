import type { AnalyticsGateway } from "@/features/analytics/core/gateways/AnalyticsGateway";

export class InMemoryAnalytics implements AnalyticsGateway {
  _pageViews: string[] = [];
  _events: { category: string; action: string; name?: string; value?: number }[] = [];

  init(): void {
    // No-op for tests
  }

  trackPageView(url: string): void {
    this._pageViews.push(url);
  }

  trackEvent(event: { category: string; action: string; name?: string; value?: number }): void {
    this._events.push(event);
  }
}
