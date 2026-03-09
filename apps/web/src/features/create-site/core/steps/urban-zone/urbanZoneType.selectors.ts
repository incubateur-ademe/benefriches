import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneType } from "shared";

import type { RootState } from "@/app/store/store";

type UrbanZoneTypeViewData = {
  urbanZoneType: UrbanZoneType | undefined;
};

export const selectUrbanZoneTypeViewData = createSelector(
  (state: RootState) => state.siteCreation.siteData.urbanZoneType,
  (urbanZoneType): UrbanZoneTypeViewData => ({ urbanZoneType }),
);
