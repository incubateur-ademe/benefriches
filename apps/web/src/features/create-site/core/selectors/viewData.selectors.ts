import { createSelector } from "@reduxjs/toolkit";
import type { SiteNature } from "shared";

import type { UserStructure } from "@/features/onboarding/core/user";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import { RootState } from "@/shared/core/store-config/store";

import type { Owner, Tenant } from "../siteFoncier.types";
import {
  selectAvailableLocalAuthoritiesWithoutCurrentOwner,
  selectAvailableLocalAuthoritiesWithoutCurrentUser,
  type AvailableLocalAuthority,
} from "../siteMunicipalityData.reducer";

const selectSiteCreation = (state: RootState) => state.siteCreation;

const selectSiteData = createSelector(selectSiteCreation, (siteCreation) => siteCreation.siteData);

const selectSiteNature = createSelector(
  selectSiteData,
  (siteData): SiteNature | undefined => siteData.nature,
);

const selectSiteOwner = createSelector(
  selectSiteData,
  (siteData): Owner | undefined => siteData.owner,
);

const selectSiteTenant = createSelector(
  selectSiteData,
  (siteData): Tenant | undefined => siteData.tenant,
);

// ============================================================================
// ViewData Selectors for Container Components
// ============================================================================

// Owner Form ViewData
export type SiteOwnerFormViewData = {
  currentUserStructure: UserStructure | undefined;
  siteNature: SiteNature | undefined;
  owner: Owner | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectSiteOwnerFormViewData = createSelector(
  [
    selectCurrentUserStructure,
    selectSiteNature,
    selectSiteOwner,
    selectAvailableLocalAuthoritiesWithoutCurrentUser,
  ],
  (currentUserStructure, siteNature, owner, localAuthoritiesList): SiteOwnerFormViewData => ({
    currentUserStructure,
    siteNature,
    owner,
    localAuthoritiesList,
  }),
);

// Tenant Form ViewData
export type SiteTenantFormViewData = {
  tenant: Tenant | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectSiteTenantFormViewData = createSelector(
  [selectSiteTenant, selectAvailableLocalAuthoritiesWithoutCurrentOwner],
  (tenant, localAuthoritiesList): SiteTenantFormViewData => ({
    tenant,
    localAuthoritiesList,
  }),
);

// Site Operator Form ViewData
export type SiteOperatorFormViewData = {
  siteOwner: Owner | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectSiteOperatorFormViewData = createSelector(
  [selectSiteOwner, selectAvailableLocalAuthoritiesWithoutCurrentOwner],
  (siteOwner, localAuthoritiesList): SiteOperatorFormViewData => ({
    siteOwner,
    localAuthoritiesList,
  }),
);
