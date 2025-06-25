import { roundToInteger } from "shared";

const RATIO_PER_HECTARE = 86289;

// Représente les dépenses de contruction de VRD dans le cas d'une comparaison projet sur friche par rapport à une extension urbaine
export const computeAvoidedRoadsAndUtilitiesConstruction = (surfaceArea: number): number => {
  return roundToInteger(RATIO_PER_HECTARE * (surfaceArea / 10000));
};
