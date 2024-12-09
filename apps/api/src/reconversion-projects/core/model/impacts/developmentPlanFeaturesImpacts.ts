import {
  EnvironmentalCo2RelatedImpacts,
  getAnnualizedCO2MonetaryValueForDuration,
  SocialImpacts,
  SocioEconomicImpact,
} from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import { DevelopmentPlan } from "../reconversionProject";
import { UrbanProjectFeatures } from "../urbanProjects";
import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";
import { getLocalPropertyValueIncreaseRelatedImpacts } from "./property-value/propertyValueImpact";
import { TravelRelatedImpactsService } from "./travel-related-impacts-service/TravelRelatedImpactsService";
import { UrbanFreshnessRelatedImpactsService } from "./urban-freshness-related-impacts-service/UrbanFreshnessRelatedImpactsService";

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

type Result = {
  socioeconomic: SocioEconomicImpact[];
} & SocialImpacts &
  EnvironmentalCo2RelatedImpacts;

export const getDevelopmentPlanRelatedImpacts = async ({
  developmentPlanType,
  developmentPlanFeatures,
  evaluationPeriodInYears,
  operationsFirstYear,
  siteSurfaceArea,
  siteCityCode,
  siteIsFriche,
  getCityRelatedDataService,
}: Input): Promise<Result> => {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT": {
      const features = developmentPlanFeatures as PhotovoltaicPowerPlantFeatures;
      const expectedAnnualProduction = features.expectedAnnualProduction;
      if (!expectedAnnualProduction) {
        return { socioeconomic: [] };
      }

      const avoidedCO2TonsWithEnergyProduction = computeAvoidedCO2TonsWithEnergyProductionImpact({
        forecastAnnualEnergyProductionMWh: expectedAnnualProduction,
      });

      const socioeconomic: SocioEconomicImpact[] = [
        {
          amount: getAnnualizedCO2MonetaryValueForDuration(
            avoidedCO2TonsWithEnergyProduction.forecast,
            operationsFirstYear,
            evaluationPeriodInYears,
          ),
          impact: "avoided_co2_eq_with_enr",
          impactCategory: "environmental_monetary",
          actor: "human_society",
        },
      ];

      const householdsPoweredByRenewableEnergy = computeHouseholdsPoweredByRenewableEnergyImpact({
        forecastRenewableEnergyAnnualProductionMWh: expectedAnnualProduction,
      });

      return {
        socioeconomic,
        avoidedCO2TonsWithEnergyProduction,
        householdsPoweredByRenewableEnergy,
      };
    }
    case "URBAN_PROJECT": {
      const features = developmentPlanFeatures as UrbanProjectFeatures;

      const city = await getCityRelatedDataService.getCityPopulationAndSurfaceArea(siteCityCode);

      const { socioeconomic: urbanFreshnessSocioEconomicImpacts, ...urbanFreshnessImpacts } =
        new UrbanFreshnessRelatedImpactsService({
          evaluationPeriodInYears,
          operationsFirstYear,
          buildingsFloorAreaDistribution: features.buildingsFloorAreaDistribution,
          spacesDistribution: features.spacesDistribution,
          siteSquareMetersSurfaceArea: siteSurfaceArea,
          citySquareMetersSurfaceArea: city.squareMetersSurfaceArea,
          cityPopulation: city.population,
        }).formatImpact();

      const { socioeconomic: travelRelatedSocioEconomicImpacts, ...travelRelatedImpacts } =
        new TravelRelatedImpactsService({
          evaluationPeriodInYears,
          operationsFirstYear,
          buildingsFloorAreaDistribution: features.buildingsFloorAreaDistribution,
          siteSquareMetersSurfaceArea: siteSurfaceArea,
          citySquareMetersSurfaceArea: city.squareMetersSurfaceArea,
          cityPopulation: city.population,
        }).formatImpact();

      const localPropertyIncreaseRelatedImpacts = await getLocalPropertyValueIncreaseRelatedImpacts(
        {
          evaluationPeriodInYears,
          siteSurfaceArea,
          siteIsFriche,
          siteCityCode,
          citySurfaceArea: city.squareMetersSurfaceArea,
          cityPopulation: city.population,
          getCityRelatedDataService,
        },
      );

      return {
        socioeconomic: [
          ...urbanFreshnessSocioEconomicImpacts,
          ...travelRelatedSocioEconomicImpacts,
          ...localPropertyIncreaseRelatedImpacts,
        ] as SocioEconomicImpact[],
        ...urbanFreshnessImpacts,
        ...travelRelatedImpacts,
      };
    }
    default:
      return { socioeconomic: [] };
  }
};
