import { sitesRoutes } from "./sites";
import {
  urbanSprawlImpactsComparisonRoutes,
  UrbanSprawlImpactsComparisonResult,
} from "./urban-sprawl-impacts-comparison";

export const API_ROUTES = {
  SITES: sitesRoutes,
  URBAN_SPRAWL_IMPACTS_COMPARISON: urbanSprawlImpactsComparisonRoutes,
} as const;

export type { UrbanSprawlImpactsComparisonResult };
