import { GetCityPopulationAndSurfaceAreaUseCase } from "src/location-features/core/usecases/getCityPopulationAndSurfaceArea.usecase";
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
  siteCityCode: string;
  getCityPopulationAndSurfaceAreaUseCase: GetCityPopulationAndSurfaceAreaUseCase;
};

export const getDevelopmentPlanRelatedImpacts = async ({
  developmentPlanType,
  developmentPlanFeatures,
  evaluationPeriodInYears,
  operationsFirstYear,
  siteSurfaceArea,
  siteCityCode,
  getCityPopulationAndSurfaceAreaUseCase,
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

      const city = await getCityPopulationAndSurfaceAreaUseCase.execute({ cityCode: siteCityCode });

      return getMixedUseNeighbourhoodSpecificImpacts({
        evaluationPeriodInYears,
        operationsFirstYear,
        features,
        siteSurfaceArea,
        citySurfaceArea: city.squareMetersSurfaceArea,
        cityPopulation: city.population,
      });
    }
    default:
      return { socioeconomic: [] };
  }
};
