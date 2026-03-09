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
