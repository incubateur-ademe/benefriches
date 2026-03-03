import { createSelector } from "@reduxjs/toolkit";

import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";

import { selectSiteData } from "../../../createProject.selectors";
import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

type SitePurchasedViewData = {
  isCurrentUserSiteOwner: boolean;
  initialValues:
    | {
        willSiteBePurchased: boolean;
      }
    | undefined;
  siteOwnerName: string | undefined;
};

export const selectSitePurchasedViewData = createSelector(
  [selectSteps, selectSiteData, selectCurrentUserStructure],
  (steps, siteData, currentUserStructure): SitePurchasedViewData => {
    const isCurrentUserSiteOwner =
      siteData && currentUserStructure
        ? siteData.owner.name === currentUserStructure.name &&
          siteData.owner.structureType === currentUserStructure.type
        : false;

    const sitePurchase = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
    );

    return {
      isCurrentUserSiteOwner,
      initialValues:
        sitePurchase?.willSiteBePurchased !== undefined
          ? { willSiteBePurchased: sitePurchase.willSiteBePurchased }
          : undefined,
      siteOwnerName: siteData ? siteData.owner.name : undefined,
    };
  },
);
