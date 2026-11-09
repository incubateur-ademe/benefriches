import { UrbanZoneLandParcel } from "shared";

// land_parcels is a jsonb column typed `unknown`: depending on how it was written it comes
// back from pg either as a parsed value or as a JSON string.
export const parseUrbanZoneLandParcels = (landParcels: unknown): UrbanZoneLandParcel[] => {
  if (!landParcels) return [];
  if (typeof landParcels === "string") {
    return JSON.parse(landParcels) as UrbanZoneLandParcel[];
  }
  return landParcels as UrbanZoneLandParcel[];
};
