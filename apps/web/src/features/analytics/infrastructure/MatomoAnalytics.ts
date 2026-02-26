import type { AnalyticsGateway } from "@/features/analytics/core/gateways/AnalyticsGateway";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _paq?: any[];
  }
}

export class MatomoAnalytics implements AnalyticsGateway {
  private readonly siteId: string;
  private readonly matomoUrl: string;

  constructor(siteId: string, matomoUrl: string) {
    this.siteId = siteId;
    this.matomoUrl = matomoUrl;
  }

  init(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _paq: any[] = (window._paq = window._paq || []);
    _paq.push(["setTrackerUrl", this.matomoUrl + "matomo.php"]);
    _paq.push(["setSiteId", this.siteId]);

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = this.matomoUrl + "matomo.js";

    const headElement = document.getElementsByTagName("head")[0];
    if (headElement) {
      headElement.appendChild(script);
    }
  }

  trackPageView(url: string): void {
    if (!window._paq) return;
    window._paq.push(["setCustomUrl", url]);
    window._paq.push(["trackPageView"]);
    window._paq.push(["enableLinkTracking"]);
  }

  trackEvent(event: { category: string; action: string; name?: string; value?: number }): void {
    if (!window._paq) return;
    window._paq.push(["trackEvent", event.category, event.action, event.name, event.value]);
  }
}
