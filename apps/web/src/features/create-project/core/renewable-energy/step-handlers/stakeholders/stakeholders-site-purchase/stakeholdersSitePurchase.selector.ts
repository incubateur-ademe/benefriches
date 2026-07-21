import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectSiteView } from "@/features/create-project/core/project-form/projectSite.types";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";

import { ReadStateHelper } from "../../../helpers/readState";

type SitePurchasedViewData = {
  isCurrentUserSiteOwner: boolean;
  initialValues:
    | {
        willSiteBePurchased: boolean;
      }
    | undefined;
  siteOwnerName: string | undefined;
};

export const createSelectSitePurchasedViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteData: Selector<RootState, ProjectSiteView | undefined>,
) =>
  createSelector(
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
