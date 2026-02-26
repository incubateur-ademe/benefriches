import type { AnalyticsGateway } from "@/features/analytics/core/gateways/AnalyticsGateway";

export class NoopAnalytics implements AnalyticsGateway {
  init(): void {
    // eslint-disable-next-line no-console
    console.info("[Analytics] No analytics provider configured");
  }

  trackPageView(url: string): void {
    // eslint-disable-next-line no-console
    console.info("[Analytics] Page view:", url);
  }

  trackEvent(event: { category: string; action: string; name?: string; value?: number }): void {
    // eslint-disable-next-line no-console
    console.info("[Analytics] Event:", event.category, event.action, event.name);
  }
}
