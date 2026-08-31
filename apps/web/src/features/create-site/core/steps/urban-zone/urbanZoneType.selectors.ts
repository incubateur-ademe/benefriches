import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneType } from "shared";

import { selectDerivedSiteData } from "../../selectors/createSite.selectors";

type UrbanZoneTypeViewData = {
  urbanZoneType: UrbanZoneType | undefined;
};

export const selectUrbanZoneTypeViewData = createSelector(
  selectDerivedSiteData,
  (siteData): UrbanZoneTypeViewData => ({ urbanZoneType: siteData.urbanZoneType }),
);
