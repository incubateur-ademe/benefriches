import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature, SoilsDistribution, SoilType } from "shared";

import { selectSiteFeaturesViewData } from "@/features/sites/core/siteFeatures.selectors";
import { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.siteCreation;

export const selectSiteAddress = createSelector(
  selectSelf,
  (state): Address | undefined => state.siteData.address,
);

export const selectSiteSoilsDistribution = createSelector(
  selectSelf,
  (state): SoilsDistribution => state.siteData.soilsDistribution ?? {},
);

export const selectFricheActivity = createSelector(
  selectSelf,
  (state) => state.siteData.fricheActivity,
);

export const selectSiteSurfaceArea = createSelector(
  selectSelf,
  (state) => state.siteData.surfaceArea,
);

export const selectSiteNature = createSelector(
  selectSelf,
  (state): SiteNature | undefined => state.siteData.nature,
);

export const selectSiteSoils = createSelector(
  selectSelf,
  (state): SoilType[] | undefined => state.siteData.soils,
);

export const selectSiteSoilsContamination = createSelector(selectSelf, (state) => {
  return {
    hasContaminatedSoils: state.siteData.hasContaminatedSoils,
    contaminatedSoilSurface: state.siteData.contaminatedSoilSurface,
  };
});

export const selectSiteAccidentsData = createSelector(selectSelf, (state) => {
  return {
    hasRecentAccidents: state.siteData.hasRecentAccidents,
    accidentsMinorInjuries: state.siteData.accidentsMinorInjuries,
    accidentsSevereInjuries: state.siteData.accidentsSevereInjuries,
    accidentsDeaths: state.siteData.accidentsDeaths,
  };
});

export const selectSurfaceAreaInputMode = createSelector(
  selectSelf,
  (state) => state.surfaceAreaInputMode,
);

export const selectSiteOwner = createSelector(selectSelf, (state) => state.siteData.owner);

const selectIsSiteOperated = createSelector(
  selectSelf,
  (state): boolean | undefined => state.siteData.isSiteOperated,
);

type SiteCreationResultViewData = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

export const selectSiteCreationResultViewData = createSelector(
  [selectSelf, selectSiteFeaturesViewData],
  (siteCreation, siteFeaturesViewData): SiteCreationResultViewData => ({
    siteId: siteCreation.siteData.id,
    siteName: siteFeaturesViewData.siteFeatures?.name ?? "",
    loadingState: siteCreation.saveLoadingState,
  }),
);

// ============================================================================
// ViewData Selectors for Container Components
// ============================================================================

// Address Form ViewData
type AddressFormViewData = {
  siteNature: SiteNature | undefined;
  address: Address | undefined;
};

export const selectAddressFormViewData = createSelector(
  [selectSiteNature, selectSiteAddress],
  (siteNature, address): AddressFormViewData => ({
    siteNature,
    address,
  }),
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

// Soil Contamination Form ViewData
type SoilContaminationFormViewData = {
  siteSurfaceArea: number | undefined;
  siteContamination: {
    hasContaminatedSoils: boolean | undefined;
    contaminatedSoilSurface: number | undefined;
  };
};

export const selectSoilContaminationFormViewData = createSelector(
  [selectSiteSurfaceArea, selectSiteSoilsContamination],
  (siteSurfaceArea, siteContamination): SoilContaminationFormViewData => ({
    siteSurfaceArea,
    siteContamination,
  }),
);

// Is Site Operated Form ViewData
type IsSiteOperatedFormViewData = {
  isSiteOperated: boolean | undefined;
  siteNature: SiteNature | undefined;
};

export const selectIsSiteOperatedFormViewData = createSelector(
  [selectIsSiteOperated, selectSiteNature],
  (isSiteOperated, siteNature): IsSiteOperatedFormViewData => ({
    isSiteOperated,
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

// Express Result ViewData
type ExpressResultViewData = {
  siteId: string;
  saveLoadingState: "idle" | "loading" | "success" | "error";
};

export const selectExpressResultViewData = createSelector(
  selectSelf,
  (siteCreation): ExpressResultViewData => ({
    siteId: siteCreation.siteData.id,
    saveLoadingState: siteCreation.saveLoadingState,
  }),
);
