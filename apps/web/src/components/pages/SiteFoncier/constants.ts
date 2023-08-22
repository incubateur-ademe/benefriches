export const SURFACE_KINDS = {
  production: {
    label: "Anciens ateliers / sites de production",
    publicodeKey: "espaces . anciens sites de production",
  },
  storage: {
    publicodeKey: "espaces . anciens espaces de stockage",
    label: "Anciens bâtiments de stockage",
  },
  quarry: {
    publicodeKey: "espaces . ancienne carrière",
    label: "Ancienne carrière",
  },
  buildings: {
    publicodeKey: "espaces . autres bâtiments",
    label: "Autres bâtiments",
  },
  concrete_car_park: {
    publicodeKey: "espaces . parking ou VRD bétonnisé",
    label: "Parking ou VRD bétonnisé",
  },
  gravel_car_park: {
    label: "Parking ou VRD gravier",
    publicodeKey: "espaces . parking ou VRD gravier",
  },
  other_sealed_surface: {
    publicodeKey: "espaces . autre surface imperméabilisée",
    label: "Autre surface imperméabilisée",
  },
  non_vegetated_permeable_surface: {
    publicodeKey: "espaces . autre suface non végétalisée perméable",
    label: "Autre suface non végétalisée perméable",
  },
  vegetated_surface: {
    publicodeKey: "espaces . surface végétalisée",
    label: "Surface végétalisée",
  },
  open_ground: {
    publicodeKey: "espaces . pleine terre",
    label: "Pleine terre",
  },
  body_of_water: {
    label: "Plan d’eau",
    publicodeKey: "espaces . plan d’eau",
  },
  other: {
    publicodeKey: "espaces . autre",
    label: "Autre / NSP",
  },
} as const;

export type SurfaceKindsType = keyof typeof SURFACE_KINDS;

export const SITE_KINDS = [
  "friche",
  "terre agricole",
  "forêt",
  "prairie",
] as const;

export type SiteKindsType = (typeof SITE_KINDS)[number];

export type SurfacesDistributionType = Partial<
  Record<SurfaceKindsType, string>
>;
