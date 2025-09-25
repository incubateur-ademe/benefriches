declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _paq?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _mtm?: any[];
  }
}
export const trackPageView = (url: string) => {
  if (!window._paq) return;
  window._paq.push(["setCustomUrl", url]);
  window._paq.push(["trackPageView"]);
  window._paq.push(["enableLinkTracking"]);
};

type AnalyticsEvent = {
  category: string;
  action: string;
  name: string;
};

export const impactsExportModalOpened = (): AnalyticsEvent => {
  return {
    category: "impacts-export",
    action: "modal-opened",
    name: "impacts-export-modal-opened",
  };
};

export const impactsExportDownloaded = (exportType: string): AnalyticsEvent => {
  return {
    category: "impacts-export",
    action: "downloaded",
    name: "impacts-export-downloaded-" + exportType,
  };
};

export const trackEvent = (event: AnalyticsEvent) => {
  if (!window._paq) return;
  window._paq.push(["trackEvent", event.category, event.action, event.name]);
};
