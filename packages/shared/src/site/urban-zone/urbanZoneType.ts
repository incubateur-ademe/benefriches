import { z } from "zod";

export const urbanZoneTypeSchema = z.enum([
  "ECONOMIC_ACTIVITY_ZONE",
  "RESIDENTIAL_ZONE",
  "PUBLIC_FACILITY",
  "MIXED_URBAN_ZONE",
]);

export type UrbanZoneType = z.infer<typeof urbanZoneTypeSchema>;

export const getLabelForUrbanZoneType = (type: UrbanZoneType): string => {
  switch (type) {
    case "ECONOMIC_ACTIVITY_ZONE":
      return "Zone d'activités économiques";
    case "RESIDENTIAL_ZONE":
      return "Zone d'habitation";
    case "PUBLIC_FACILITY":
      return "Équipement public";
    case "MIXED_URBAN_ZONE":
      return "Zone urbaine mixte";
  }
};
