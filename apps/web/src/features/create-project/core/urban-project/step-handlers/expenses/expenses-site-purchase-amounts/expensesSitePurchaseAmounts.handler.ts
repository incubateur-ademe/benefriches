import { computePropertyTransferDutiesFromSellingPrice, roundToInteger } from "shared";

import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpensesSitePurchaseAmountsHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },

  getNextStepId({ answers, context }) {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    if (involvesReinstatement !== false && context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_EXPENSES_REINSTATEMENT";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
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

    const sitePurchaseSellingPrice = roundToInteger(
      landWithoutBuildingsMedianPricePerSquareMeters * siteSurfaceArea,
    );

    return {
      sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: roundToInteger(
        computePropertyTransferDutiesFromSellingPrice(sitePurchaseSellingPrice),
      ),
    };
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS">;
