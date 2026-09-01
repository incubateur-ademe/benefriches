import { createSelector } from "@reduxjs/toolkit";
import { generateSiteName } from "shared";

import type { createSiteFormRootSelectors } from "../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../stateHelpers";

type NamingViewData = {
  siteId: string;
  initialValues: {
    name: string;
    description?: string;
  };
};

export const createUrbanZoneNamingSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectUrbanZoneNamingViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps, rootSelectors.selectDerivedSiteData],
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

  return { selectUrbanZoneNamingViewData };
};

export const { selectUrbanZoneNamingViewData } =
  createUrbanZoneNamingSelectors(siteCreationRootSelectors);
