import {
  getGreenArtificalSurfaceArea,
  getImpermeableSurfaceArea,
  SoilsDistribution,
} from "../soils/soilDistribution";

type ProjectReinstatementCosts = {
  deimpermeabilization?: number;
  sustainableSoilsReinstatement?: number;
  remediation?: number;
  demolition?: number;
  asbestosRemoval?: number;
};

export const computeProjectReinstatementCosts = (
  siteSoilsDistribution: SoilsDistribution,
  projectSoilsDistribution: SoilsDistribution,
  decontaminatedSoilSurface: number,
): ProjectReinstatementCosts => {
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
