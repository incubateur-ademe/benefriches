import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import { DevelopmentPlan } from "../../reconversionProject";
import { UrbanProjectFeatures } from "../../urbanProjects";
import {
  getPhotovoltaicProjectSpecificImpacts,
  PhotovoltaicSocioEconomicSpecificImpact,
} from "./photovoltaicPowerPlantImpacts";
import {
  getUrbanProjectSpecificImpacts,
  UrbanProjectSocioEconomicSpecificImpact,
} from "./urbanProjectImpacts";

export type SocioEconomicSpecificImpact =
  | PhotovoltaicSocioEconomicSpecificImpact
  | UrbanProjectSocioEconomicSpecificImpact;

type PhotovoltaicPowerPlantFeatures = Extract<
  DevelopmentPlan,
  { type: "PHOTOVOLTAIC_POWER_PLANT" }
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
    case "URBAN_PROJECT": {
      const features = developmentPlanFeatures as UrbanProjectFeatures;

      return await getUrbanProjectSpecificImpacts({
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
