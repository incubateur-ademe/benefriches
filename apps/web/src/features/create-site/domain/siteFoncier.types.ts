import { FricheActivity } from "./friche.types";

export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type Address = {
  id: string;
  value: string;
  city: string;
  cityCode: string;
  postCode: string;
  streetNumber?: string;
  streetName?: string;
  long: number;
  lat: number;
};

export type SiteFoncier = {
  isFriche: boolean;
  name: string;
  description?: string;
  address: Address;
  // soils
  surfaceArea: number;
  soils: SoilType[];
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
  // contamination
  contaminatedSoilSurface?: number;
  fricheActivity?: FricheActivity;
  // management
  fullTimeJobsInvolved: number;
  owner: { type: OwnerType; name?: string };
  tenantBusinessName: string;
  hasRecentAccidents: boolean;
  minorInjuriesPerson?: number;
  severeInjuriesPerson?: number;
  deaths?: number;
  yearlyExpenses: Expense[];
  yearlyIncome?: number;
};

export enum SoilType {
  BUILDINGS = "BUILDINGS",
  IMPERMEABLE_SOILS = "IMPERMEABLE_SOILS",
  MINERAL_SOIL = "MINERAL_SOIL",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED = "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  ARTIFICIAL_TREE_FILLED = "ARTIFICIAL_TREE_FILLED",
  FOREST_DECIDUOUS = "FOREST_DECIDUOUS",
  FOREST_CONIFER = "FOREST_CONIFER",
  FOREST_POPLAR = "FOREST_POPLAR",
  FOREST_MIXED = "FOREST_MIXED",
  PRAIRIE_GRASS = "PRAIRIE_GRASS",
  PRAIRIE_BUSHES = "PRAIRIE_BUSHES",
  PRAIRIE_TREES = "PRAIRIE_TREES",
  ORCHARD = "ORCHARD", // verger
  CULTIVATION = "CULTIVATION", // culture
  VINEYARD = "VINEYARD", // vigne
  WET_LAND = "WET_LAND", // zone humide
  WATER = "WATER", // plan d'eau
}

export enum OwnerType {
  MUNICIPALITY = "MUNICIPALITY", // commune
  COMMUNITY_OF_MUNICIPALITIES = "COMMUNITY_OF_MUNICIPALITIES", // communauté de communes
  DEPARTMENT = "DEPARTMENT",
  REGION = "REGION",
  STATE = "STATE",
  COMPANY = "COMPANY",
  PRIVATE_INDIVIDUAL = "PRIVATE_INDIVIDUAL",
}

export type Expense = {
  type: string;
  bearer: "owner" | "tenant" | "local_or_regional_authority" | "society";
  amount: number;
};
