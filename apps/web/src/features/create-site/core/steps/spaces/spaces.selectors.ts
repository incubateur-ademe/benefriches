import { createSelector } from "@reduxjs/toolkit";
import {
  SoilsDistribution,
  SoilType,
  SurfaceAreaDistribution,
  SurfaceAreaDistributionJson,
} from "shared";
import type {
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
  UrbanZoneType,
} from "shared";

import { RootState } from "@/app/store/store";

import {
  selectDerivedSiteData,
  selectSiteNature,
  selectSiteSoils,
  selectSiteSurfaceArea,
} from "../../selectors/createSite.selectors";

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
  selectDerivedSiteData,
  (state: RootState) => state.siteCreation.surfaceAreaInputMode,
  (siteData, surfaceAreaInputMode): SiteSoilsDistributionViewData => {
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
  siteNature?: SiteNature;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  fricheActivity?: FricheActivity;
  naturalAreaType?: NaturalAreaType;
  urbanZoneType?: UrbanZoneType;
};

export const selectSiteSoilsSummaryViewData = createSelector(
  selectDerivedSiteData,
  (siteData): SiteSoilsSummaryViewData => {
    return {
      totalSurfaceArea: siteData.surfaceArea ?? 0,
      soilsDistribution: siteData.soilsDistribution ?? {},
      wasSoilsDistributionAssignedByBenefriches: siteData.spacesDistributionKnowledge === false,
      siteNature: siteData.nature,
      agriculturalOperationActivity: siteData.agriculturalOperationActivity,
      fricheActivity: siteData.fricheActivity,
      naturalAreaType: siteData.naturalAreaType,
      urbanZoneType: siteData.urbanZoneType,
    };
  },
);

// Site Surface Area Form ViewData
type SiteSurfaceAreaFormViewData = {
  siteSurfaceArea: number | undefined;
  siteNature: SiteNature | undefined;
};

export const selectSiteSurfaceAreaFormViewData = createSelector(
  [selectSiteSurfaceArea, selectSiteNature],
  (siteSurfaceArea, siteNature): SiteSurfaceAreaFormViewData => ({
    siteSurfaceArea,
    siteNature,
  }),
);

// Spaces Selection Form ViewData
type SpacesSelectionFormViewData = {
  siteNature: SiteNature | undefined;
  soils: SoilType[];
};

export const selectSpacesSelectionFormViewData = createSelector(
  [selectSiteNature, selectSiteSoils],
  (siteNature, soils): SpacesSelectionFormViewData => ({
    siteNature,
    soils: soils ?? [],
  }),
);
