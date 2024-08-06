import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DevelopmentPlan } from "../../reconversionProject";
import {
  getMixedUseNeighbourhoodSpecificImpacts,
  MixedUseNeighbourhoodSocioEconomicSpecificImpact,
} from "./mixedUseNeighbourhoodImpacts";
import {
  getPhotovoltaicProjectSpecificImpacts,
  PhotovoltaicSocioEconomicSpecificImpact,
} from "./photovoltaicPowerPlantImpacts";

export type SocioEconomicSpecificImpact =
  | PhotovoltaicSocioEconomicSpecificImpact
  | MixedUseNeighbourhoodSocioEconomicSpecificImpact;

type PhotovoltaicPowerPlantFeatures = Extract<
  DevelopmentPlan,
  { type: "PHOTOVOLTAIC_POWER_PLANT" }
>["features"];

type MixedUseNeighbourhoodFeatures = Extract<
  DevelopmentPlan,
  { type: "MIXED_USE_NEIGHBOURHOOD" }
>["features"];

type Input = {
  developmentPlanType?: DevelopmentPlan["type"];
  developmentPlanFeatures?: DevelopmentPlan["features"];
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  siteSurfaceArea: number;
  siteIsFriche: boolean;
  siteCityCode: string;
  getCityRelatedDataService: GetCityRelatedDataService;
};

export const getDevelopmentPlanRelatedImpacts = async ({
  developmentPlanType,
  developmentPlanFeatures,
  evaluationPeriodInYears,
  operationsFirstYear,
  siteSurfaceArea,
  siteCityCode,
  siteIsFriche,
  getCityRelatedDataService,
}: Input) => {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT": {
      const features = developmentPlanFeatures as PhotovoltaicPowerPlantFeatures;
      return getPhotovoltaicProjectSpecificImpacts({
        evaluationPeriodInYears,
        operationsFirstYear,
        expectedAnnualProduction: features.expectedAnnualProduction,
      });
    }
    case "MIXED_USE_NEIGHBOURHOOD": {
      const features = developmentPlanFeatures as MixedUseNeighbourhoodFeatures;

      return await getMixedUseNeighbourhoodSpecificImpacts({
        evaluationPeriodInYears,
        operationsFirstYear,
        features,
        siteSurfaceArea,
        siteIsFriche,
        siteCityCode,
        getCityRelatedDataService,
      });
    }
    default:
      return { socioeconomic: [] };
  }
};
