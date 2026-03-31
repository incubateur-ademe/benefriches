import type { UrbanZoneLandParcelType } from "shared";

export const PARCEL_TYPE_LABELS: Record<UrbanZoneLandParcelType, string> = {
  COMMERCIAL_ACTIVITY_AREA: "Surface d'activité",
  PUBLIC_SPACES: "Espaces publics",
  SERVICED_SURFACE: "Surface viabilisée",
  RESERVED_SURFACE: "Surface réservée",
};

export const PARCEL_TYPE_DESCRIPTIONS: Record<UrbanZoneLandParcelType, string> = {
  COMMERCIAL_ACTIVITY_AREA: "Surface cédée, déjà construite ou imperméabilisée",
  PUBLIC_SPACES: "Voirie, espaces verts...",
  SERVICED_SURFACE: "Vouée à être construite",
  RESERVED_SURFACE: "Vouée à être viabilisée",
};

const PARCEL_TYPE_COLORS: Record<UrbanZoneLandParcelType, string> = {
  COMMERCIAL_ACTIVITY_AREA: "#137FEB",
  PUBLIC_SPACES: "#B0BED9",
  SERVICED_SURFACE: "#81A50D",
  RESERVED_SURFACE: "#B8EC13",
};

const PARCEL_TYPE_PICTOGRAMS: Record<UrbanZoneLandParcelType, string> = {
  COMMERCIAL_ACTIVITY_AREA: "commercial-activity-area.svg",
  PUBLIC_SPACES: "public-spaces.svg",
  SERVICED_SURFACE: "serviced-surface.svg",
  RESERVED_SURFACE: "reserved-surface.svg",
};

export const getColorForLandParcelType = (parcelType: UrbanZoneLandParcelType): string => {
  return PARCEL_TYPE_COLORS[parcelType];
};

export const getPictogramForUrbanZoneLandParcelType = (
  parcelType: UrbanZoneLandParcelType,
): string => {
  return `/img/pictograms/urban-zone-land-parcels/${PARCEL_TYPE_PICTOGRAMS[parcelType]}`;
};
