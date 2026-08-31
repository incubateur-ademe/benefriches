import { createSelector } from "@reduxjs/toolkit";
import { generateSiteName } from "shared";

import type { RootState } from "@/app/store/store";

import { selectDerivedSiteData } from "../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../stateHelpers";

type NamingViewData = {
  siteId: string;
  initialValues: {
    name: string;
    description?: string;
  };
};

export const selectUrbanZoneNamingViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps, selectDerivedSiteData],
  (steps, siteData): NamingViewData => {
    const answer = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_NAMING");
    const initialName =
      answer?.name ??
      generateSiteName({
        cityName: siteData.address?.city ?? "",
        nature: "URBAN_ZONE",
        urbanZone: siteData.urbanZoneType,
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
