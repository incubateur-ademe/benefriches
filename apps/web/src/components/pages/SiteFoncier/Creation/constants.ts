const SPACES_LABELS = {
  production: "Anciens ateliers / sites de production",
  storage: "Anciens bâtiments de stockage",
  quarry: "Ancienne carrière",
  buildings: "Autres bâtiments",
  concrete_car_park: "Parking ou VRD bétonnisé",
  gravel_car_park: "Parking ou VRD gravier",
  other_sealed_surface: "Autre surface imperméabilisée",
  non_vegetated_permeable_surface: "Autre suface non végétalisée perméable",
  vegetated_surface: "Surface végétalisée",
  open_ground: "Plaine terre",
  body_of_water: "Plan d’eau",
  other: "Autre / NSP",
} as const;

const SPACES_KEYS = [
  "production",
  "storage",
  "quarry",
  "buildings",
  "concrete_car_park",
  "gravel_car_park",
  "other_sealed_surface",
  "non_vegetated_permeable_surface",
  "vegetated_surface",
  "open_ground",
  "body_of_water",
  "other",
] as const;

export { SPACES_LABELS, SPACES_KEYS };

export const SITE_KINDS = [
  "friche",
  "terre agricole",
  "forêt",
  "prairie",
] as const;
