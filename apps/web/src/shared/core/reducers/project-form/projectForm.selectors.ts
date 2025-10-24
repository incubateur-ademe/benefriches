import { createSelector } from "@reduxjs/toolkit";
import { Address, SoilsDistribution } from "shared";

import { ProjectSite } from "@/features/create-project/core/project.types";

import { RootState } from "../../store-config/store";
import {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
} from "./helpers/stakeholders";

export type ProjectFormSelectors = {
  selectSiteAddress: (state: RootState) => ProjectSite["address"] | undefined;
  selectSiteSoilsDistribution: (state: RootState) => SoilsDistribution;
  selectSiteSurfaceArea: (state: RootState) => number;
  selectProjectAvailableStakeholders: (state: RootState) => AvailableProjectStakeholder[];
  selectAvailableLocalAuthoritiesStakeholders: (
    state: RootState,
  ) => AvailableLocalAuthorityStakeholder[];
  selectSiteContaminatedSurfaceArea: (state: RootState) => number;
};

export const createProjectFormSelectors = (entityName: "projectCreation" | "projectUpdate") => {
  const selectSelf = (state: RootState) => state[entityName];

  const selectSiteData = createSelector(selectSelf, (state) => state.siteData);

  const selectSiteSoilsDistribution = createSelector(
    selectSiteData,
    (siteData): SoilsDistribution => siteData?.soilsDistribution ?? {},
  );

  const selectSiteAddress = createSelector(selectSiteData, (siteData): Address | undefined => {
    return siteData?.address;
  });

  const selectProjectAvailableStakeholders = createSelector(
    [selectSiteData, (state: RootState) => state.currentUser.currentUser],
    (siteData, currentUser) => {
      return getProjectAvailableStakeholders({
        siteOwner: siteData?.owner,
        siteTenant: siteData?.tenant,
        currentUser: currentUser
          ? {
              structureActivity: currentUser.structureActivity,
              structureType: currentUser.structureType,
              structureName: currentUser.structureName,
            }
          : undefined,
      });
    },
  );

  const selectAvailableLocalAuthoritiesStakeholders = createSelector(
    [
      (state: RootState) => state[entityName].siteRelatedLocalAuthorities,
      selectProjectAvailableStakeholders,
    ],
    (siteRelatedLocalAuthorities, projectAvailableStakeholders) => {
      return getAvailableLocalAuthoritiesStakeholders(
        siteRelatedLocalAuthorities,
        projectAvailableStakeholders,
      );
    },
  );

  const selectSiteSurfaceArea = createSelector(
    selectSiteData,
    (siteData): number => siteData?.surfaceArea ?? 0,
  );

  const selectSiteContaminatedSurfaceArea = createSelector(
    selectSiteData,
    (siteData): number => siteData?.contaminatedSoilSurface ?? 0,
  );

  return {
    selectSiteAddress,
    selectSiteSoilsDistribution,
    selectProjectAvailableStakeholders,
    selectAvailableLocalAuthoritiesStakeholders,
    selectSiteSurfaceArea,
    selectSiteContaminatedSurfaceArea,
  };
};
