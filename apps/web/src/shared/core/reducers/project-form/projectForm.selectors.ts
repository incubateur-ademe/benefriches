import { createSelector } from "@reduxjs/toolkit";
import { Address, SoilsDistribution } from "shared";

import { RootState } from "../../store-config/store";

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

  return {
    selectSiteAddress,
    selectSiteSoilsDistribution,
  };
};
