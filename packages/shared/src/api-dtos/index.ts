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
  getFricheInactionCostResponseDtoSchema,
  type GetFricheInactionCostDto,
  type GetSiteImpactsDto,
} from "./sites";

// Urban Sprawl Impacts Comparison DTOs
export {
  getUrbanSprawlImpactsComparisonDtoSchema,
  type UrbanSprawlImpactsComparisonResultDto,
} from "./urban-sprawl-impacts-comparison";

// Site Actions DTOs
export { updateSiteActionStatusDtoSchema, type UpdateSiteActionStatusDto } from "./site-actions";

// City Rurality DTOs
export {
  getCityRuralityRequestDtoSchema,
  type GetCityRuralityRequestDto,
  getCityRuralityResponseDtoSchema,
  type GetCityRuralityResponseDto,
} from "./city-rurality";

// Reconversion Projects DTOs
export {
  type GetReconversionProjectFeaturesResponseDto,
  type GetReconversionProjectImpactsResultDto,
} from "./reconversion-projects";
