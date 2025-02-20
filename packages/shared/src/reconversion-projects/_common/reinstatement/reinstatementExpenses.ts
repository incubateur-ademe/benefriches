import { TExpense } from "../../../financial";
import {
  getGreenArtificalSurfaceArea,
  getImpermeableSurfaceArea,
  SoilsDistribution,
} from "../../../soils/soilDistribution";

export type ReinstatementExpensePurpose =
  | "asbestos_removal"
  | "deimpermeabilization"
  | "demolition"
  | "other_reinstatement"
  | "remediation"
  | "sustainable_soils_reinstatement"
  | "waste_collection";
export type ReinstatementExpense = TExpense<ReinstatementExpensePurpose>;

export type ComputedReinstatementExpenses = {
  deimpermeabilization?: number;
  sustainableSoilsReinstatement?: number;
  remediation?: number;
  demolition?: number;
  asbestosRemoval?: number;
};

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
      impermeableSoilsDelta < 0 ? Math.abs(impermeableSoilsDelta) * 10 : undefined,
    sustainableSoilsReinstatement:
      impermeableSoilsDelta < 0 && artificialGreenSoilsDelta > 0
        ? artificialGreenSoilsDelta * 45
        : undefined,
    remediation: decontaminatedSoilSurface > 0 ? decontaminatedSoilSurface * 66 : undefined,
    demolition: siteSoilsDistribution.BUILDINGS ? siteSoilsDistribution.BUILDINGS * 75 : undefined,
    asbestosRemoval: siteSoilsDistribution.BUILDINGS
      ? siteSoilsDistribution.BUILDINGS * 75
      : undefined,
  };
};
