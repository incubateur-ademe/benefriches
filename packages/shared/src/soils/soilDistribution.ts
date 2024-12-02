import { isImpermeableSoil, SoilType } from ".";
import { typedObjectEntries } from "../object-entries";
import { roundTo1Digit } from "../services";

export type SoilsDistribution = Partial<Record<SoilType, number>>;

export class NewSoilsDistribution {
  private readonly surfaceBySoilType: Map<SoilType, number>;

  constructor() {
    this.surfaceBySoilType = new Map();
  }

  static fromJSON(jsonSoilsDistribution: SoilsDistribution): NewSoilsDistribution {
    const soilsDistribution = new NewSoilsDistribution();
    typedObjectEntries(jsonSoilsDistribution).forEach(([soilType, surfaceArea]) => {
      soilsDistribution.addSurface(soilType, surfaceArea ?? 0);
    });
    return soilsDistribution;
  }

  addSurface(soilType: SoilType, surface: number) {
    if (surface <= 0) return;

    const existingSurfaceAreaForSoilType = this.surfaceBySoilType.get(soilType);
    const surfaceAreaToSave = existingSurfaceAreaForSoilType
      ? existingSurfaceAreaForSoilType + surface
      : surface;
    this.surfaceBySoilType.set(soilType, surfaceAreaToSave);
  }

  getTotalSurfaceArea(): number {
    return Array.from(this.surfaceBySoilType.values()).reduce((sum, surface) => sum + surface, 0);
  }

  getDistributionInPercentage(): SoilsDistribution {
    const totalSurface = this.getTotalSurfaceArea();
    const rawPercentageEntries: [soilType: SoilType, percentage: number][] = [];
    let totalRoundedPercentage = 0;

    // compute rounded percentages to 1 digit
    this.surfaceBySoilType.forEach((surfaceArea, soilType) => {
      const percentage = (surfaceArea / totalSurface) * 100;
      const roundedPercentage = roundTo1Digit(percentage);
      totalRoundedPercentage += roundedPercentage;
      rawPercentageEntries.push([soilType, roundedPercentage]);
    });

    // compte adjustment to ensure total equals 100
    const neededAdjustment = 100 - totalRoundedPercentage;
    if (neededAdjustment > 0.1) {
      const lastEntry = rawPercentageEntries.pop();
      if (!lastEntry) return {};
      const roundedNewValue = roundTo1Digit(lastEntry[1] + neededAdjustment);
      rawPercentageEntries.push([lastEntry[0], roundedNewValue]);
    }

    return rawPercentageEntries.reduce((acc, cur) => {
      const [soilType, surfaceArea] = cur;
      return { ...acc, [soilType]: surfaceArea };
    }, {});
  }

  toJSON(): SoilsDistribution {
    return Array.from(this.surfaceBySoilType.entries()).reduce((acc, cur) => {
      const [soilType, surfaceArea] = cur;
      return { ...acc, [soilType]: surfaceArea };
    }, {});
  }
}

export const getTotalSurfaceArea = (soilsDistribution: SoilsDistribution): number => {
  return typedObjectEntries(soilsDistribution).reduce((sum, [, area]) => sum + (area ?? 0), 0);
};

export const sumSoilsSurfaceAreasWhere = (
  soilsDistribution: SoilsDistribution,
  cb: (s: SoilType) => boolean,
) => {
  return typedObjectEntries(soilsDistribution)
    .filter(([soilType]) => cb(soilType))
    .reduce((sum, [, area]) => sum + (area ?? 0), 0);
};

export const getImpermeableSurfaceArea = (soilsDistribution: SoilsDistribution): number => {
  return sumSoilsSurfaceAreasWhere(soilsDistribution, (soilType) => isImpermeableSoil(soilType));
};

export const getGreenArtificalSurfaceArea = (soilsDistribution: SoilsDistribution): number => {
  return sumSoilsSurfaceAreasWhere(
    soilsDistribution,
    (soilType) =>
      soilType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" || soilType === "ARTIFICIAL_TREE_FILLED",
  );
};

export const stripEmptySurfaces = (soilsDistribution: SoilsDistribution): SoilsDistribution => {
  return typedObjectEntries(soilsDistribution).reduce((acc, [soilType, surfaceArea]) => {
    return surfaceArea ? { ...acc, [soilType]: surfaceArea } : acc;
  }, {});
};
