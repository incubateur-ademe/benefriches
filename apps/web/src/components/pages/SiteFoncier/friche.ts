import { SiteFoncier, SiteFoncierType } from "./siteFoncier";

export type FricheSite = SiteFoncier & {
  type: SiteFoncierType.FRICHE;
  lastActivity?: FricheLastActivity;
  spaces: { type: FricheSpaceType; surface?: number }[];
};

export enum FricheSpaceType {
  "IMPERMEABLE_SOILS" = "impermeable_soils",
  "BUILDINGS" = "buildings",
  "PERMEABLE_ARTIFICIAL_SOILS" = "permeable_artificial_soils",
  "NATURAL_AREAS" = "natural_areas",
  "AGRICULTURAL_LAND" = "AGRICULTURAL_LAND",
  "OTHER" = "other",
}

export enum FricheLastActivity {
  AGRICULTURE = "AGRICULTURE",
  INDUSTRY = "INDUSTRY",
  MINE_OR_QUARRY = "MINE_OR_QUARRY",
  HOUSING_OR_BUSINESS = "HOUSING_OR_BUSINESS",
}
