import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { selectUrbanZoneNamingViewData } from "../naming/naming.selectors";

type UrbanZoneCreationResultViewData = {
  siteId: string;
  siteName: string;
  saveState: "idle" | "loading" | "success" | "error";
};

export const selectUrbanZoneCreationResultViewData = createSelector(
  [selectUrbanZoneNamingViewData, (state: RootState) => state.siteCreation.urbanZone.saveState],
  (namingViewData, saveState): UrbanZoneCreationResultViewData => ({
    siteId: namingViewData.siteId,
    siteName: namingViewData.initialValues.name,
    saveState,
  }),
);
