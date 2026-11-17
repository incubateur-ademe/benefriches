import {
  computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces,
  computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces,
  computePropertyTransferDutiesFromSellingPrice,
  roundToInteger,
} from "shared";

import { isSiteResalePlannedAfterDevelopment } from "@/features/create-project/core/urban-project/helpers/readers/siteResaleReaders";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import { getProjectSoilDistributionBySoilType } from "../../../helpers/readers/soilsReaders";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueBuildingsResaleHandler = {
  stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",

  getPreviousStepId(params) {
    if (isSiteResalePlannedAfterDevelopment(params.answers)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },

  getDefaultAnswers({ context, answers }) {
    const { siteCityReferenceData } = context;
    const { loadingState, landAndRealEstateValues } = siteCityReferenceData ?? {};
    const { propertyValueMedianPricePerSquareMeters } = landAndRealEstateValues ?? {};
    const usesFloorSurfaceAreaDistribution = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
    )?.usesFloorSurfaceAreaDistribution;

    const buildingsFootprint = getProjectSoilDistributionBySoilType(answers)?.BUILDINGS;
    const floorDistribution = usesFloorSurfaceAreaDistribution ?? {
      RESIDENTIAL: buildingsFootprint,
    };

    const useCityReferenceData =
      loadingState === "success" &&
      propertyValueMedianPricePerSquareMeters &&
      buildingsFootprint &&
      buildingsFootprint !== 0;

    const buildingsResaleSellingPrice = useCityReferenceData
      ? computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
          buildingFootprintArea: buildingsFootprint,
          buildingsFloorAreaDistribution: floorDistribution,
          propertyValueMedianPricePerSquareMeters: propertyValueMedianPricePerSquareMeters,
        })
      : computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces(floorDistribution);

    return {
      buildingsResaleSellingPrice,
      buildingsResalePropertyTransferDuties: buildingsResaleSellingPrice
        ? roundToInteger(computePropertyTransferDutiesFromSellingPrice(buildingsResaleSellingPrice))
        : undefined,
    };
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_BUILDINGS_RESALE">;
