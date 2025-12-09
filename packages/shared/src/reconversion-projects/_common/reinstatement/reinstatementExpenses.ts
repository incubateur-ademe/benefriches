import z from "zod";

import { TExpense } from "../../../financial";
import { roundToInteger } from "../../../services";
import {
  getGreenArtificalSurfaceArea,
  getImpermeableSurfaceArea,
  SoilsDistribution,
} from "../../../soils/soilDistribution";

export const reinstatementExpensesPurposeSchema = z.enum([
  "asbestos_removal",
  "deimpermeabilization",
  "demolition",
  "other_reinstatement",
  "remediation",
  "sustainable_soils_reinstatement",
  "waste_collection",
]);

export type ReinstatementExpensePurpose = z.infer<typeof reinstatementExpensesPurposeSchema>;
export type ReinstatementExpense = TExpense<ReinstatementExpensePurpose>;

export type ComputedReinstatementExpenses = {
  deimpermeabilization?: number;
  sustainableSoilsReinstatement?: number;
  remediation?: number;
  demolition?: number;
  asbestosRemoval?: number;
};

export const EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION = 10;
export const EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT = 45;
export const EURO_PER_SQUARE_METERS_FOR_REMEDIATION = 66;
export const EURO_PER_SQUARE_METERS_FOR_DEMOLITION = 75;
export const EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL = 75;

export const computeProjectReinstatementExpenses = (
  siteSoilsDistribution: SoilsDistribution,
  projectSoilsDistribution: SoilsDistribution,
  decontaminatedSoilSurface: number,
): ComputedReinstatementExpenses => {
  const impermeableSoilsDelta =
    getImpermeableSurfaceArea(projectSoilsDistribution) -
    getImpermeableSurfaceArea(siteSoilsDistribution);

  const artificialGreenSoilsDelta =
    getGreenArtificalSurfaceArea(projectSoilsDistribution) -
    getGreenArtificalSurfaceArea(siteSoilsDistribution);

  return {
    deimpermeabilization:
      impermeableSoilsDelta < 0
        ? roundToInteger(
            Math.abs(impermeableSoilsDelta) * EURO_PER_SQUARE_METERS_FOR_DEIMPERMEABILIZATION,
          )
        : undefined,
    sustainableSoilsReinstatement:
      impermeableSoilsDelta < 0 && artificialGreenSoilsDelta > 0
        ? roundToInteger(
            artificialGreenSoilsDelta * EURO_PER_SQUARE_METERS_FOR_SUSTAINABLE_SOILS_REINSTATEMENT,
          )
        : undefined,
    remediation:
      decontaminatedSoilSurface > 0
        ? roundToInteger(decontaminatedSoilSurface * EURO_PER_SQUARE_METERS_FOR_REMEDIATION)
        : undefined,
    demolition: siteSoilsDistribution.BUILDINGS
      ? roundToInteger(siteSoilsDistribution.BUILDINGS * EURO_PER_SQUARE_METERS_FOR_DEMOLITION)
      : undefined,
    asbestosRemoval: siteSoilsDistribution.BUILDINGS
      ? roundToInteger(
          siteSoilsDistribution.BUILDINGS * EURO_PER_SQUARE_METERS_FOR_ASBESTOS_REMOVAL,
        )
      : undefined,
  };
};
