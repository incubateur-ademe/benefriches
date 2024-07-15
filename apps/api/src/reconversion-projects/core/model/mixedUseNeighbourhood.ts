import { z } from "zod";
import { SoilType } from "src/soils/domain/soils";

const mixedUseNeighbourHoodSpaceSchema = z.record(
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
type Space = keyof SpacesDistribution;

export const getSoilTypeForSpace = (space: Space): SoilType => {
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

const buildingsFloorAreaUsageDistribution = z.record(
  z.enum(["RESIDENTIAL", "GROUND_FLOOR_RETAIL"]),
  z.number().nonnegative(),
);

export const mixedUseNeighbourhoodFeaturesSchema = z.object({
  spacesDistribution: mixedUseNeighbourHoodSpaceSchema,
  buildingsFloorAreaDistribution: buildingsFloorAreaUsageDistribution,
});

export type MixedUseNeighbourhoodFeatures = z.infer<typeof mixedUseNeighbourhoodFeaturesSchema>;
