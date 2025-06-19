import {
  getUrbanSprawlImpactsComparison,
  UrbanSprawlImpactsComparisonResult,
} from "./getUrbanSprawlImpactsComparison";

export const urbanSprawlImpactsComparisonRoutes = {
  GET: getUrbanSprawlImpactsComparison,
} as const;

export type { UrbanSprawlImpactsComparisonResult };
