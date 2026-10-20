const USER_STRUCTURE_TYPE_LABELS: Record<string, string> = {
  local_authority: "Collectivité",
  company: "Entreprise",
};

const USER_STRUCTURE_ACTIVITY_LABELS: Record<string, string> = {
  urban_planner: "Aménageur",
  local_authority_landlord: "Bailleur social",
  real_estate_developer: "Promoteur",
  photovoltaic_plants_developer: "Développeur photovoltaïque",
  industrialist: "Industriel",
  other: "Autre",
  municipality: "Mairie",
  epci: "Établissement public de coopération intercommunale",
  department: "Département",
  region: "Région",
};

export const getUserStructureTypeLabel = (type: string): string =>
  USER_STRUCTURE_TYPE_LABELS[type] ?? type;

export const getUserStructureActivityLabel = (activity: string): string =>
  USER_STRUCTURE_ACTIVITY_LABELS[activity] ?? activity;
