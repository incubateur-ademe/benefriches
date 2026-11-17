import { computePropertyTransferDutiesFromSellingPrice, roundToInteger } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SitePurchaseAmountsHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",

    getNextStepId(params) {
      const involvesReinstatement = ReadStateHelper.getStepAnswers(
        params.answers,
        "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
      )?.involvesReinstatement;
      return involvesReinstatement === true
        ? "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"
        : "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION";
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

      const sellingPrice = roundToInteger(
        landWithoutBuildingsMedianPricePerSquareMeters * siteSurfaceArea,
      );

      return {
        sellingPrice,
        propertyTransferDuties: roundToInteger(
          computePropertyTransferDutiesFromSellingPrice(sellingPrice),
        ),
      };
    },
  };
