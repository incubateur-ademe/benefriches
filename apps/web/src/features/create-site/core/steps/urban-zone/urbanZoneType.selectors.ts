import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneType } from "shared";

import type { createSiteFormRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../selectors/createSite.selectors";

type UrbanZoneTypeViewData = {
  urbanZoneType: UrbanZoneType | undefined;
};

export const createUrbanZoneTypeSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectUrbanZoneTypeViewData = createSelector(
    rootSelectors.selectDerivedSiteData,
    (siteData): UrbanZoneTypeViewData => ({ urbanZoneType: siteData.urbanZoneType }),
  );

  return { selectUrbanZoneTypeViewData };
};

export const { selectUrbanZoneTypeViewData } =
  createUrbanZoneTypeSelectors(siteCreationRootSelectors);
