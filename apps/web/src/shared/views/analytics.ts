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
  value?: unknown;
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

export const hideExpressSiteDisclaimerClicked = (): AnalyticsEvent => {
  return {
    category: "site-page",
    action: "hide-express-site-disclaimer-clicked",
    name: "site-page/hide-express-site-disclaimer-clicked",
  };
};

export const hideImpactsAccuracyDisclaimerClicked = (): AnalyticsEvent => {
  return {
    category: "impacts-page",
    action: "hide-impacts-accuracy-disclaimer-clicked",
    name: "impacts-page/hide-impacts-accuracy-disclaimer-clicked",
  };
};

export const saveFricheFromCompatibilityEvaluationClicked = (): AnalyticsEvent => {
  return {
    category: "reconversion-compatibility-evaluation-results",
    action: "save-friche-clicked",
    name: "save-friche-from-compatibility-evaluation-clicked",
  };
};

export const trackEvent = (event: AnalyticsEvent) => {
  if (!window._paq) return;
  window._paq.push(["trackEvent", event.category, event.action, event.name, event.value]);
};
