import { z } from "zod";
import { TExpense } from "../financial";
import { SoilType } from "../soils";

export const mixedUseNeighbourHoodSpaceSchema = z.record(
  z.enum([
    // private spaces
    "BUILDINGS_FOOTPRINT", // emprise au sol bâti = surface occupée au sol par les bâtiments
    "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT",
    "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT",
    "PRIVATE_GARDEN_AND_GRASS_ALLEYS",
    // public spaces
    "PUBLIC_GREEN_SPACES",
    "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS",
    "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS",
    "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS",
    "PUBLIC_PARKING_LOT",
  ]),
  z.number().nonnegative(),
);

export type SpacesDistribution = z.infer<typeof mixedUseNeighbourHoodSpaceSchema>;
export type MixedUseNeighbourhoodSpace = keyof SpacesDistribution;

export const getSoilTypeForSpace = (space: MixedUseNeighbourhoodSpace): SoilType => {
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
  }
};

export const buildingsFloorAreaUsageDistribution = z.record(
  z.enum(["RESIDENTIAL", "GROUND_FLOOR_RETAIL"]),
  z.number().nonnegative(),
);

export type MixedUseNeighbourhoodDevelopmentExpense = TExpense<
  "technical_studies" | "development_works" | "other"
>;
