import { createSelector } from "@reduxjs/toolkit";
import { AgriculturalOperationActivity, FricheActivity, NaturalAreaType } from "shared";

import type { RootState } from "@/app/store/store";
import { selectSiteFeaturesViewData } from "@/features/sites/core/siteFeatures.selectors";

import { ReadStateHelper } from "../../demoFactory";

const selectSelf = (state: RootState) => state.siteCreation;

type DemoSiteCreationResultViewData = {
  siteId: string;
  siteName: string;
  saveState: "idle" | "loading" | "success" | "error";
  siteAddress: {
    postCode?: string;
    cityName?: string;
  };
  siteActivity?:
    | {
        type: "AGRICULTURAL_OPERATION";
        agriculturalOperationActivity: AgriculturalOperationActivity;
      }
    | {
        type: "NATURAL_AREA";
        naturalAreaType: NaturalAreaType;
      }
    | {
        type: "FRICHE";
        fricheActivity: FricheActivity;
      };
};

const selectSiteAddress = (state: RootState): DemoSiteCreationResultViewData["siteAddress"] => {
  const { steps } = state.siteCreation.demo;

  const { address } = ReadStateHelper.getStepAnswers(steps, "DEMO_SITE_ADDRESS") ?? {};

  return {
    postCode: address?.postCode,
    cityName: address?.city,
  };
};

const selectSiteActivity = (state: RootState): DemoSiteCreationResultViewData["siteActivity"] => {
  const { steps } = state.siteCreation.demo;
  const activity = ReadStateHelper.getStepAnswers(steps, "DEMO_SITE_ACTIVITY_SELECTION");

  switch (activity?.siteNature) {
    case "AGRICULTURAL_OPERATION":
      return {
        type: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: activity.agriculturalOperationActivity,
      };
    case "FRICHE":
      return { type: "FRICHE", fricheActivity: activity.fricheActivity };
    case "NATURAL_AREA":
      return { type: "NATURAL_AREA", naturalAreaType: activity.naturalAreaType };
    default:
      return undefined;
  }
};

export const selectDemoSiteCreationResultViewData = createSelector(
  [selectSelf, selectSiteAddress, selectSiteActivity, selectSiteFeaturesViewData],
  (
    siteCreation,
    siteAddress,
    siteActivity,
    siteFeaturesViewData,
  ): DemoSiteCreationResultViewData => ({
    siteId: siteCreation.siteData.id,
    siteName: siteFeaturesViewData.siteFeatures?.name ?? "",
    saveState: siteCreation.demo.saveState,
    siteAddress,
    siteActivity,
  }),
);
