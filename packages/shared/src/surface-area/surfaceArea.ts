import { typedObjectEntries } from "../object-entries";
import { roundTo1Digit } from "../services";

export type SurfaceAreaDistributionJson<TSurface extends string> = Partial<
  Record<TSurface, number>
>;

export class SurfaceAreaDistribution<TSurface extends string> {
  private readonly surfaceAreaMap: Map<TSurface, number>;

  constructor() {
    this.surfaceAreaMap = new Map<TSurface, number>();
  }

  static fromJSON<T extends string>(
    jsonSurfaceDistribution: SurfaceAreaDistributionJson<T>,
  ): SurfaceAreaDistribution<T> {
    const surfaceAreaDistribution = new SurfaceAreaDistribution<T>();
    typedObjectEntries(jsonSurfaceDistribution).forEach(([surfaceType, surfaceArea]) => {
      surfaceAreaDistribution.addSurface(surfaceType, surfaceArea ?? 0);
    });
    return surfaceAreaDistribution;
  }

  static fromJSONPercentage<T extends string>(input: {
    totalSurfaceArea: number;
    percentageDistribution: SurfaceAreaDistributionJson<T>;
  }): SurfaceAreaDistribution<T> {
    const sd = new SurfaceAreaDistribution<T>();

    typedObjectEntries(input.percentageDistribution).forEach(([surfaceType, percent]) => {
      const surfaceAreaInSquareMeters = ((percent ?? 0) * input.totalSurfaceArea) / 100;
      sd.addSurface(surfaceType, surfaceAreaInSquareMeters);
    });
    return sd;
  }

  addSurface(surfaceType: TSurface, surface: number) {
    if (surface <= 0) return;

    const existingSurfaceAreaForSoilType = this.surfaceAreaMap.get(surfaceType);
    const surfaceAreaToSave = existingSurfaceAreaForSoilType
      ? existingSurfaceAreaForSoilType + surface
      : surface;
    this.surfaceAreaMap.set(surfaceType, surfaceAreaToSave);
  }

  getTotalSurfaceArea(): number {
    return Array.from(this.surfaceAreaMap.values()).reduce((sum, surface) => sum + surface, 0);
  }

  getDistributionInPercentage(): SurfaceAreaDistributionJson<TSurface> {
    const totalSurface = this.getTotalSurfaceArea();
    const rawPercentageEntries: [surfaceType: TSurface, percentage: number][] = [];
    let totalRoundedPercentage = 0;

    // compute rounded percentages to 1 digit
    this.surfaceAreaMap.forEach((surfaceArea, surfaceType) => {
      const percentage = (surfaceArea / totalSurface) * 100;
      const roundedPercentage = roundTo1Digit(percentage);
      totalRoundedPercentage += roundedPercentage;
      rawPercentageEntries.push([surfaceType, roundedPercentage]);
    });

    // compute adjustment to ensure total equals 100
    const neededAdjustment = 100 - totalRoundedPercentage;
    if (neededAdjustment > 0.1) {
      const lastEntry = rawPercentageEntries.pop();
      if (!lastEntry) return {};
      const roundedNewValue = roundTo1Digit(lastEntry[1] + neededAdjustment);
      rawPercentageEntries.push([lastEntry[0], roundedNewValue]);
    }

    return rawPercentageEntries.reduce((acc, cur) => {
      const [surfaceType, surfaceArea] = cur;
      return { ...acc, [surfaceType]: surfaceArea };
    }, {});
  }

  toJSON(): SurfaceAreaDistributionJson<TSurface> {
    return Array.from(this.surfaceAreaMap.entries()).reduce((acc, cur) => {
      const [surfaceType, surfaceArea] = cur;
      return { ...acc, [surfaceType]: surfaceArea };
    }, {});
  }
}
