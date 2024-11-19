import { z } from "zod";

import { TExpense } from "../../financial";
import { SoilType } from "../../soils";

export const urbanProjectSpacesCategories = z.enum([
  "LIVING_AND_ACTIVITY_SPACES",
  "PUBLIC_SPACES",
  "GREEN_SPACES",
  "URBAN_FARM",
  "RENEWABLE_ENERGY_PRODUCTION_PLANT",
  "URBAN_POND_OR_LAKE",
]);

export type UrbanSpaceCategory = z.infer<typeof urbanProjectSpacesCategories>;

export const urbanProjectsSpaceSchema = z.record(
  z.enum([
    // private spaces
    "BUILDINGS_FOOTPRINT", // emprise au sol bâti = surface occupée au sol par les bâtiments
    "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT",
    "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT",
    "PRIVATE_GARDEN_AND_GRASS_ALLEYS",
    "PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS",
    // public spaces
    "PUBLIC_GREEN_SPACES",
    "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS",
    "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS",
    "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS",
    "PUBLIC_PARKING_LOT",
  ]),
  z.number().nonnegative(),
);

export type SpacesDistribution = z.infer<typeof urbanProjectsSpaceSchema>;
export type UrbanProjectSpace = keyof SpacesDistribution;

export const getSoilTypeForSpace = (space: UrbanProjectSpace): SoilType => {
  switch (space) {
    case "BUILDINGS_FOOTPRINT":
      return "BUILDINGS";
    case "PUBLIC_PARKING_LOT":
    case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
    case "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "IMPERMEABLE_SOILS";
    case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
    case "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS":
    case "PUBLIC_GREEN_SPACES":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
    case "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "MINERAL_SOIL";
    case "PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS":
      return "ARTIFICIAL_TREE_FILLED";
  }
};

export const buildingsUseSchema = z.enum([
  "RESIDENTIAL",
  "GROUND_FLOOR_RETAIL",
  "TERTIARY_ACTIVITIES",
  "NEIGHBOURHOOD_FACILITIES_AND_SERVICES",
  "PUBLIC_FACILITIES",
  "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
  "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
  "MULTI_STORY_PARKING",
  "SOCIO_CULTURAL_PLACE",
  "SPORTS_FACILITIES",
  "OTHER",
]);

export const buildingsFloorAreaUsageDistribution = z.record(
  buildingsUseSchema,
  z.number().nonnegative(),
);
export type BuildingFloorAreaUsageDistribution = z.infer<
  typeof buildingsFloorAreaUsageDistribution
>;

export type UrbanProjectDevelopmentExpense = TExpense<
  "technical_studies" | "development_works" | "other"
>;
