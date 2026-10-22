import type { UserStructureActivity, UserStructureType } from "@/shared/core/userStructure";

const USER_STRUCTURE_TYPE_LABELS: Record<UserStructureType, string> = {
  local_authority: "Collectivité",
  company: "Entreprise",
};

const USER_STRUCTURE_ACTIVITY_LABELS: Record<UserStructureActivity, string> = {
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

const isUserStructureType = (value: string): value is UserStructureType =>
  Object.hasOwn(USER_STRUCTURE_TYPE_LABELS, value);

const isUserStructureActivity = (value: string): value is UserStructureActivity =>
  Object.hasOwn(USER_STRUCTURE_ACTIVITY_LABELS, value);

export const getUserStructureTypeLabel = (type: string): string =>
  isUserStructureType(type) ? USER_STRUCTURE_TYPE_LABELS[type] : type;

export const getUserStructureActivityLabel = (activity: string): string =>
  isUserStructureActivity(activity) ? USER_STRUCTURE_ACTIVITY_LABELS[activity] : activity;
