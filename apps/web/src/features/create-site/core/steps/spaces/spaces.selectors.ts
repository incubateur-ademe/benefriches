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

import type { createSiteFormRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../selectors/createSite.selectors";

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

// Site Surface Area Form ViewData
type SiteSurfaceAreaFormViewData = {
  siteSurfaceArea: number | undefined;
  siteNature: SiteNature | undefined;
};

// Spaces Selection Form ViewData
type SpacesSelectionFormViewData = {
  siteNature: SiteNature | undefined;
  soils: SoilType[];
};

export const createSpacesSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectSiteSoilsDistributionViewData = createSelector(
    rootSelectors.selectDerivedSiteData,
    rootSelectors.selectSurfaceAreaInputMode,
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

  const selectSiteSoilsSummaryViewData = createSelector(
    rootSelectors.selectDerivedSiteData,
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

  const selectSiteSurfaceAreaFormViewData = createSelector(
    [rootSelectors.selectSiteSurfaceArea, rootSelectors.selectSiteNature],
    (siteSurfaceArea, siteNature): SiteSurfaceAreaFormViewData => ({
      siteSurfaceArea,
      siteNature,
    }),
  );

  const selectSpacesSelectionFormViewData = createSelector(
    [rootSelectors.selectSiteNature, rootSelectors.selectSiteSoils],
    (siteNature, soils): SpacesSelectionFormViewData => ({
      siteNature,
      soils: soils ?? [],
    }),
  );

  return {
    selectSiteSoilsDistributionViewData,
    selectSiteSoilsSummaryViewData,
    selectSiteSurfaceAreaFormViewData,
    selectSpacesSelectionFormViewData,
  };
};

export const {
  selectSiteSoilsDistributionViewData,
  selectSiteSoilsSummaryViewData,
  selectSiteSurfaceAreaFormViewData,
  selectSpacesSelectionFormViewData,
} = createSpacesSelectors(siteCreationRootSelectors);
