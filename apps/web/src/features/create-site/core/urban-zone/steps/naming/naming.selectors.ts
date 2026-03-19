import { createSelector } from "@reduxjs/toolkit";
import { generateSiteName } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../stateHelpers";

type NamingViewData = {
  siteId: string;
  initialValues: {
    name: string;
    description?: string;
  };
};

export const selectUrbanZoneNamingViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.urbanZone.steps,
    (state: RootState) => state.siteCreation.siteData,
  ],
  (steps, siteData): NamingViewData => {
    const answer = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_NAMING");
    const initialName =
      answer?.name ??
      generateSiteName({
        cityName: siteData.address?.city ?? "",
        nature: "URBAN_ZONE",
      });
    return {
      siteId: siteData.id,
      initialValues: {
        name: initialName,
        description: answer?.description,
      },
    };
  },
);
