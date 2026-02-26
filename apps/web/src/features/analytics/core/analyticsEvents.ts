import type { AnalyticsEvent } from "./eventTracked.action";

export const impactsExportModalOpened = (): AnalyticsEvent => ({
  category: "impacts-export",
  action: "modal-opened",
  name: "impacts-export-modal-opened",
});

export const impactsExportDownloaded = (exportType: string): AnalyticsEvent => ({
  category: "impacts-export",
  action: "downloaded",
  name: "impacts-export-downloaded-" + exportType,
});

export const expressSiteDisclaimerHidden = (): AnalyticsEvent => ({
  category: "site-page",
  action: "hide-express-site-disclaimer-clicked",
  name: "site-page/hide-express-site-disclaimer-clicked",
});

export const impactsAccuracyDisclaimerHidden = (): AnalyticsEvent => ({
  category: "impacts-page",
  action: "hide-impacts-accuracy-disclaimer-clicked",
  name: "impacts-page/hide-impacts-accuracy-disclaimer-clicked",
});

export const fricheFromCompatibilityEvaluationSaved = (): AnalyticsEvent => ({
  category: "reconversion-compatibility-evaluation-results",
  action: "save-friche-clicked",
  name: "save-friche-from-compatibility-evaluation-clicked",
});
