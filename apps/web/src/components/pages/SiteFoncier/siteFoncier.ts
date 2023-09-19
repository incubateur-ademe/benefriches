import { BanFeature } from "@/helpers/baseAdresseNationaleSearch";

export enum SiteFoncierType {
  FRICHE = "friche",
  TERRE_AGRICOLE = "terre agricole",
  PRAIRIE = "prairie",
  FORET = "forêt",
}

export type SiteFoncier = {
  name: string;
  description: string;
  type: SiteFoncierType;
  location: {
    address: string;
    ban?: BanFeature;
  };
  surface: number;
};

export enum FricheSurfaceType {
  "IMPERMEABLE_SOILS" = "impermeable_soils",
  "BUILDINGS" = "buildings",
  "PERMEABLE_ARTIFICIAL_SOILS" = "permeable_artificial_soils",
  "NATURAL_AREAS" = "natural_areas",
  "BODY_OF_WATER" = "body_of_water",
  "OTHER" = "other",
}

export type FricheSite = SiteFoncier & {
  lastActivity: "agricole" | "industrial" | "quarry" | "accomodation" | "other";
  surfaces: { type: FricheSurfaceType; surface: number }[];
};
