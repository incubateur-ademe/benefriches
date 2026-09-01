import type { GetSiteFeaturesResponseDto, SiteEditability, UpdateCustomSiteDto } from "shared";

// Raw `GetSiteFeaturesResponseDto`, NOT the flattened `SiteFeatures`/`SiteView` shapes
// `HttpSiteService` maps to for the read-only site page: `mapApiSiteFeaturesResponseToFeaturesView`
// there flattens `address` to a plain string and drops `owner.structureType`/
// `tenant.structureType`, both of which the wizard's ADDRESS/OWNER/TENANT steps need to hydrate.
export type SiteUpdateView = { features: GetSiteFeaturesResponseDto } & SiteEditability;

export interface UpdateSiteServiceGateway {
  getById(siteId: string): Promise<SiteUpdateView | undefined>;
  save(siteId: string, payload: UpdateCustomSiteDto): Promise<void>;
}
