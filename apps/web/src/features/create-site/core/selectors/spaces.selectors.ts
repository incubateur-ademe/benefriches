import { createSelector } from "@reduxjs/toolkit";
import {
  SoilsDistribution,
  SoilType,
  SurfaceAreaDistribution,
  SurfaceAreaDistributionJson,
} from "shared";

import { RootState } from "@/shared/core/store-config/store";

type SurfaceAreaDistributionWithUnit<TSurface extends string> = {
  unit: "percentage" | "squareMeters";
  value: SurfaceAreaDistributionJson<TSurface>;
};
const getSurfaceAreaDistributionWithUnit = <TSurface extends string>(
  surfaceAreaDistributionInSquareMeters: SurfaceAreaDistributionJson<TSurface>,
  outputUnit: "percentage" | "squareMeters",
): SurfaceAreaDistributionWithUnit<TSurface> => {
  const surfaceAreaDistribution = SurfaceAreaDistribution.fromJSON(
    surfaceAreaDistributionInSquareMeters,
  );
  return outputUnit === "percentage"
    ? {
        unit: "percentage",
        value: surfaceAreaDistribution.getDistributionInPercentage(),
      }
    : { unit: "squareMeters", value: surfaceAreaDistribution.toJSON() };
};

type SiteSoilsDistributionViewData = {
  initialValues: SurfaceAreaDistributionWithUnit<SoilType>;
  siteSoils: SoilType[];
  siteSurfaceArea: number;
};

export const selectSiteSoilsDistributionViewData = createSelector(
  (state: RootState) => state.siteCreation,
  ({ siteData, surfaceAreaInputMode }): SiteSoilsDistributionViewData => {
    const siteSoils = siteData.soils;
    const siteSurfaceArea = siteData.surfaceArea ?? 0;

    const initialValues = getSurfaceAreaDistributionWithUnit(
      siteData.soilsDistribution ?? {},
      surfaceAreaInputMode,
    );

    return { initialValues, siteSoils, siteSurfaceArea };
  },
);

type SiteSoilsSummaryViewData = {
  totalSurfaceArea: number;
  soilsDistribution: SoilsDistribution;
  wasSoilsDistributionAssignedByBenefriches: boolean;
};

export const selectSiteSoilsSummaryViewData = createSelector(
  (state: RootState) => state.siteCreation,
  (siteCreation): SiteSoilsSummaryViewData => {
    return {
      totalSurfaceArea: siteCreation.siteData.surfaceArea ?? 0,
      soilsDistribution: siteCreation.siteData.soilsDistribution ?? {},
      wasSoilsDistributionAssignedByBenefriches:
        siteCreation.siteData.spacesDistributionKnowledge === false,
    };
  },
);
