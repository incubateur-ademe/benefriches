import {
  roundTo1Digit,
  SurfaceAreaDistribution,
  SurfaceAreaDistributionJson,
  typedObjectEntries,
} from "shared";

type SurfaceAreaDistributionWithUnit<TSurface extends string> = {
  unit: "percentage" | "squareMeters";
  value: SurfaceAreaDistributionJson<TSurface>;
};

const getDistributionInPercentage = <TSurface extends string>(
  distribution: SurfaceAreaDistributionJson<TSurface>,
  totalSurfaceArea: number,
): SurfaceAreaDistributionJson<TSurface> => {
  const result: SurfaceAreaDistributionJson<TSurface> = {};
  typedObjectEntries(distribution).forEach(([key, value]) => {
    result[key] = roundTo1Digit(((value ?? 0) / totalSurfaceArea) * 100);
  });
  return result;
};

export const getSurfaceAreaDistributionWithUnit = <TSurface extends string>(
  surfaceAreaDistributionInSquareMeters: SurfaceAreaDistributionJson<TSurface>,
  outputUnit: "percentage" | "squareMeters",
  totalSurfaceArea?: number,
): SurfaceAreaDistributionWithUnit<TSurface> => {
  if (outputUnit === "percentage") {
    if (totalSurfaceArea !== undefined) {
      return {
        unit: "percentage",
        value: getDistributionInPercentage(surfaceAreaDistributionInSquareMeters, totalSurfaceArea),
      };
    }
    const surfaceAreaDistribution = SurfaceAreaDistribution.fromJSON(
      surfaceAreaDistributionInSquareMeters,
    );
    return {
      unit: "percentage",
      value: surfaceAreaDistribution.getDistributionInPercentage(),
    };
  }

  return { unit: "squareMeters", value: surfaceAreaDistributionInSquareMeters };
};
