// Auth DTOs
export {
  registerUserRequestDtoSchema,
  type RegisterUserRequestDto,
  getCurrentUserResponseDtoSchema,
  type GetCurrentUserResponseDto,
} from "./auth";

// Sites DTOs
export {
  createCustomSiteDtoSchema,
  type CreateCustomSiteDto,
  createExpressSiteDtoSchema,
  type CreateExpressSiteDto,
  getSiteFeaturesResponseDtoSchema,
  type GetSiteFeaturesResponseDto,
  getSiteViewResponseDtoSchema,
  type GetSiteViewResponseDto,
  getSiteRealEstateValuationResponseDtoSchema,
  type GetSiteRealEstateValuationResponseDto,
  type GetFricheInactionCostDto,
  type GetSiteImpactsDto,
} from "./sites";

// Urban Sprawl Impacts Comparison DTOs
export {
  getUrbanSprawlImpactsComparisonDtoSchema,
  type UrbanSprawlImpactsComparisonResultDto,
  type StatuQuoSiteImpacts,
  type SiteTaxesIncomeImpact,
} from "./urban-sprawl-impacts-comparison";

// Site Actions DTOs
export { updateSiteActionStatusDtoSchema, type UpdateSiteActionStatusDto } from "./site-actions";

// Reconversion Projects DTOs
export { type GetReconversionProjectFeaturesResponseDto } from "./reconversion-projects";
