import { SiteFeaturesView, SiteView } from "../models/views";

export type SiteSurfaceAreaAndCityCode = {
  surfaceArea: number;
  cityCode: string;
};

export interface SitesQuery {
  getSiteFeaturesById(siteId: string): Promise<SiteFeaturesView | undefined>;
  getViewById(siteId: string): Promise<SiteView | undefined>;
  getMutafrichesIdBySiteId(siteId: string): Promise<string | null>;
  getSiteSurfaceAreaAndCityCode(siteId: string): Promise<SiteSurfaceAreaAndCityCode | undefined>;
}
