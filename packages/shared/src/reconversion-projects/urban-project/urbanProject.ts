import { z } from "zod";

export const LEGACY_urbanProjectsSpaceSchema = z.partialRecord(
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

export type LEGACY_SpacesDistribution = z.infer<typeof LEGACY_urbanProjectsSpaceSchema>;
export type LEGACY_UrbanProjectSpace = keyof LEGACY_SpacesDistribution;
