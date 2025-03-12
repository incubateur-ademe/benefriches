import { createSelector } from "@reduxjs/toolkit";
import { SoilType, SurfaceAreaDistribution, SurfaceAreaDistributionJson } from "shared";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
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
  selectAppSettings,
  (siteCreation, appSettings): SiteSoilsDistributionViewData => {
    const siteSoils = siteCreation.siteData.soils;
    const siteSurfaceArea = siteCreation.siteData.surfaceArea ?? 0;

    const initialValues = getSurfaceAreaDistributionWithUnit(
      siteCreation.siteData.soilsDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );

    return { initialValues, siteSoils, siteSurfaceArea };
  },
);
