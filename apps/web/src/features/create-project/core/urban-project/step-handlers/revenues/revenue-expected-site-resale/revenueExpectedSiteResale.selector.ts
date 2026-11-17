import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RelatedSiteCityReferenceData } from "@/features/create-project/core/project-form/projectSite.types";
import { shouldPrefillSiteResalePrice } from "@/features/create-project/core/urban-project/helpers/readers/siteResaleReaders";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type SiteResaleRevenueViewData = {
  defaultValues:
    | {
        sellingPrice?: number;
        propertyTransferDuties?: number;
      }
    | undefined;
  currentValues: {
    sellingPrice?: number;
    propertyTransferDuties?: number;
  };
  landAndRealEstateValues?: SiteCityReferenceViewData;
};

type SiteCityReferenceViewData =
  | (RelatedSiteCityReferenceData["landAndRealEstateValues"] & {
      cityName?: string;
      addressLabel: string;
      loadingState: RelatedSiteCityReferenceData["loadingState"];
    })
  | undefined;

export const createSelectSiteResaleRevenueViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
  selectSiteCityReferenceViewData: Selector<RootState, SiteCityReferenceViewData>,
) =>
  createSelector(
    [selectStepState, selectSiteCityReferenceViewData],
    (steps, siteCityReferenceData): SiteResaleRevenueViewData => {
      const revenueAnswers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      );
      const revenueDefaultAnswers = ReadStateHelper.getDefaultAnswers(
        steps,
        "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      );

      const initialValues = shouldPrefillSiteResalePrice(steps)
        ? (revenueAnswers ?? revenueDefaultAnswers)
        : revenueAnswers;

      return {
        defaultValues: revenueDefaultAnswers
          ? {
              sellingPrice: revenueDefaultAnswers?.siteResaleExpectedSellingPrice,
              propertyTransferDuties:
                revenueDefaultAnswers?.siteResaleExpectedPropertyTransferDuties,
            }
          : undefined,
        currentValues: {
          sellingPrice: initialValues?.siteResaleExpectedSellingPrice,
          propertyTransferDuties: initialValues?.siteResaleExpectedPropertyTransferDuties,
        },
        landAndRealEstateValues: siteCityReferenceData,
      };
    },
  );
