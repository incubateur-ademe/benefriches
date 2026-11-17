import { computePropertyTransferDutiesFromSellingPrice, roundToInteger } from "shared";

import { willDeveloperResellBuildings } from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueExpectedSiteResaleHandler = {
  stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",

  getPreviousStepId() {
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId({ answers }) {
    if (willDeveloperResellBuildings(answers)) {
      return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },

  getDefaultAnswers({ context }) {
    const { siteCityReferenceData, siteData } = context;
    const { loadingState, landAndRealEstateValues } = siteCityReferenceData ?? {};
    const { landWithoutBuildingsMedianPricePerSquareMeters } = landAndRealEstateValues ?? {};
    const siteSurfaceArea = siteData?.surfaceArea;

    if (
      loadingState !== "success" ||
      !siteSurfaceArea ||
      !landWithoutBuildingsMedianPricePerSquareMeters
    ) {
      return undefined;
    }

    const siteResaleExpectedSellingPrice = roundToInteger(
      landWithoutBuildingsMedianPricePerSquareMeters * siteSurfaceArea,
    );
    return {
      siteResaleExpectedSellingPrice,
      siteResaleExpectedPropertyTransferDuties: roundToInteger(
        computePropertyTransferDutiesFromSellingPrice(siteResaleExpectedSellingPrice),
      ),
    };
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE">;
