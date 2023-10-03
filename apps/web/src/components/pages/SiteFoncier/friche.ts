import { SiteFoncier, SiteFoncierType } from "./siteFoncier";

export type FricheSite = SiteFoncier & {
  type: SiteFoncierType.FRICHE;
  lastActivity?: FricheLastActivity;
  spaces: FricheSpace[];
};

export enum FricheLastActivity {
  AGRICULTURE = "AGRICULTURE",
  INDUSTRY = "INDUSTRY",
  MINE_OR_QUARRY = "MINE_OR_QUARRY",
  HOUSING_OR_BUSINESS = "HOUSING_OR_BUSINESS",
  UNKNOWN = "UNKNOWN",
}

export enum FricheSpaceType {
  IMPERMEABLE_SOILS = "impermeable_soils",
  BUILDINGS = "buildings",
  PERMEABLE_ARTIFICIAL_SOILS = "permeable_artificial_soils",
  NATURAL_AREAS = "natural_areas",
  OTHER = "other",
}

type FricheSpace =
  | PermeableArtificializedSoilSpace
  | {
      type:
        | FricheSpaceType.IMPERMEABLE_SOILS
        | FricheSpaceType.BUILDINGS
        | FricheSpaceType.NATURAL_AREAS
        | FricheSpaceType.OTHER;
      surface?: number;
    };

export type PermeableArtificializedSoilSpace = {
  type: FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS;
  soilComposition?: { type: PermeableArtificializedSoil; surface?: number }[];
};

export enum PermeableArtificializedSoil {
  MINERAL = "MINERAL",
  TREE_FILLED = "TREE_FILLED",
  GRASS_OR_BUSHES_FILLED = "GRASS_OR_BUSHES_FILLED",
}
