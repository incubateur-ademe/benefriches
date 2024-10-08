import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import { MixedUseNeighbourhoodFeatures } from "../../mixedUseNeighbourhood";
import { CO2eqMonetaryValueService } from "../services/CO2eqMonetaryValueService";
import { GetInfluenceAreaValuesService } from "../services/GetInfluenceAreaValuesService";
import { TravelRelatedImpactsService } from "../services/TravelRelatedImpactsService";
import { UrbanFreshnessRelatedImpactsService } from "../services/UrbanFreshnessRelatedImpactsService";
import { computePropertyValueImpact } from "../socio-economic/property-value/propertyValueImpact";

export type MixedUseNeighbourhoodSocioEconomicSpecificImpact =
  | AvoidedCarRelatedExpensesImpact
  | AvoidedAirConditioningExpensesImpact
  | TravelTimeSavedImpact
  | AvoidedTrafficAccidentsImpact
  | AvoidedTrafficCO2EqEmissions
  | AvoidedAirConditioningCO2EqEmissions
  | AvoidedAirPollutionImpact
  | LocalHousingPropertyValueIncreaseImpact
  | LocalTransferDutiesIncreaseImpact;

type BaseEconomicImpact = { actor: string; amount: number };
type AvoidedCarRelatedExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_car_related_expenses";
  impactCategory: "economic_indirect";
  actor: "local_residents";
};

type AvoidedAirConditioningExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_air_conditioning_expenses";
  impactCategory: "economic_indirect";
  actor: "local_residents";
};

type TravelTimeSavedImpact = BaseEconomicImpact & {
  impact: "travel_time_saved";
  impactCategory: "economic_indirect";
  actor: "local_residents" | "local_workers";
};

type AvoidedTrafficAccidentsImpact = BaseEconomicImpact & {
  impact: "avoided_traffic_accidents";
  impactCategory: "social_monetary";
  actor: "french_society";
  details: {
    amount: number;
    impact:
      | "avoided_traffic_minor_injuries"
      | "avoided_traffic_severe_injuries"
      | "avoided_traffic_deaths";
  }[];
};

type AvoidedTrafficCO2EqEmissions = BaseEconomicImpact & {
  impact: "avoided_traffic_co2_eq_emissions";
  impactCategory: "environmental_monetary";
  actor: "human_society";
};

type AvoidedAirConditioningCO2EqEmissions = BaseEconomicImpact & {
  impact: "avoided_air_conditioning_co2_eq_emissions";
  impactCategory: "environmental_monetary";
  actor: "human_society";
};

type AvoidedAirPollutionImpact = BaseEconomicImpact & {
  actor: "human_society";
  impactCategory: "environmental_monetary";
  impact: "avoided_air_pollution";
};

type LocalHousingPropertyValueIncreaseImpact = BaseEconomicImpact & {
  impact: "local_property_value_increase";
  impactCategory: "economic_indirect";
  actor: "local_residents";
};

type LocalTransferDutiesIncreaseImpact = BaseEconomicImpact & {
  impact: "local_transfer_duties_increase";
  impactCategory: "economic_indirect";
  actor: "community";
};

const getUrbanFreshnessInfluenceRadius = (
  publicGreenSpaceSurfaceRatio: number,
  publicGreenSpaceSurface: number,
) => {
  if (publicGreenSpaceSurface < 5000) {
    return publicGreenSpaceSurfaceRatio < 95 ? 0 : 25;
  }

  if (publicGreenSpaceSurface < 10000) {
    return publicGreenSpaceSurfaceRatio < 50 ? 25 : 50;
  }

  if (publicGreenSpaceSurfaceRatio < 10) {
    return 0;
  }

  return publicGreenSpaceSurfaceRatio < 75 ? 50 : 75;
};

type UrbanFreshnessInput = {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  features: MixedUseNeighbourhoodFeatures;
  siteSurfaceArea: number;
  citySurfaceArea: number;
  cityPopulation: number;
};

export const getUrbanFreshnessRelatedImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  features,
  siteSurfaceArea,
  citySurfaceArea,
  cityPopulation,
}: UrbanFreshnessInput): {
  socioeconomic: MixedUseNeighbourhoodSocioEconomicSpecificImpact[];
  avoidedAirConditioningCo2EqEmissions?: number;
} => {
  const { buildingsFloorAreaDistribution, spacesDistribution } = features;
  const publicGreenSpaceSurface = spacesDistribution.PUBLIC_GREEN_SPACES;

  const hasPublicGreenSpaces = publicGreenSpaceSurface && publicGreenSpaceSurface !== 0;
  if (!hasPublicGreenSpaces) {
    return { socioeconomic: [] };
  }

  const publicGreenSpaceSurfaceRatio = (publicGreenSpaceSurface / siteSurfaceArea) * 100;

  const minRatio = publicGreenSpaceSurface < 5000 ? 50 : publicGreenSpaceSurface < 10000 ? 10 : 0;
  const noUrbanFreshnessImpact = publicGreenSpaceSurfaceRatio < minRatio;

  if (noUrbanFreshnessImpact) {
    return { socioeconomic: [] };
  }

  const influenceRadius = getUrbanFreshnessInfluenceRadius(
    publicGreenSpaceSurfaceRatio,
    publicGreenSpaceSurface,
  );

  const influenceAreaService = new GetInfluenceAreaValuesService(
    siteSurfaceArea,
    citySurfaceArea,
    cityPopulation,
    influenceRadius,
  );

  const co2eqMonetaryValueService = new CO2eqMonetaryValueService();

  const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService(
    influenceAreaService,
    co2eqMonetaryValueService,
    buildingsFloorAreaDistribution.RESIDENTIAL ?? 0,
    0,
    buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0,
    evaluationPeriodInYears,
    operationsFirstYear,
  );

  const socioeconomic = [
    {
      actor: "human_society",
      amount:
        urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2EmissionsMonetaryValue(),
      impact: "avoided_air_conditioning_co2_eq_emissions",
      impactCategory: "environmental_monetary",
    },
    {
      actor: "local_residents",
      amount: urbanFreshnessRelatedImpactsService.getAvoidedInhabitantsAirConditioningExpenses(),
      impact: "avoided_air_conditioning_expenses",
      impactCategory: "economic_indirect",
    },
    {
      actor: "local_companies",
      amount:
        urbanFreshnessRelatedImpactsService.getAvoidedBusinessBuildingsAirConditioningExpenses(),
      impact: "avoided_air_conditioning_expenses",
      impactCategory: "economic_indirect",
    },
  ] as MixedUseNeighbourhoodSocioEconomicSpecificImpact[];

  return {
    socioeconomic: socioeconomic.filter(({ amount }) => amount > 0),
    avoidedAirConditioningCo2EqEmissions:
      urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2EmissionsInTons(),
  };
};

const getTravelRelatedImpactInfluenceRadius = (
  tertiaryActivitySurface: number,
  groundFloorRetailSurface: number,
  publicCulturalAndSportsFacilitiesSurface: number,
) => {
  const economicActivitySurface = tertiaryActivitySurface + groundFloorRetailSurface;

  if (economicActivitySurface === 0 && publicCulturalAndSportsFacilitiesSurface === 0) {
    return 0;
  }

  if (economicActivitySurface < 151 && publicCulturalAndSportsFacilitiesSurface === 0) {
    return 100;
  }

  if (economicActivitySurface < 300 && publicCulturalAndSportsFacilitiesSurface === 0) {
    return 200;
  }

  return 500;
};

type TravelInput = {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  features: MixedUseNeighbourhoodFeatures;
  siteSurfaceArea: number;
  citySurfaceArea: number;
  cityPopulation: number;
};
export const getTravelRelatedImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  features,
  siteSurfaceArea,
  citySurfaceArea,
  cityPopulation,
}: TravelInput) => {
  const { buildingsFloorAreaDistribution, spacesDistribution } = features;

  const publicCulturalAndSportsFacilitiesSurface = [
    spacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
    spacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
    spacesDistribution.PUBLIC_GREEN_SPACES ?? 0,
    spacesDistribution.PUBLIC_PARKING_LOT ?? 0,
    spacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
  ].reduce((sum, value) => sum + value, 0);

  const influenceRadius = getTravelRelatedImpactInfluenceRadius(
    0,
    buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0,
    publicCulturalAndSportsFacilitiesSurface,
  );

  const influenceAreaService = new GetInfluenceAreaValuesService(
    siteSurfaceArea,
    citySurfaceArea,
    cityPopulation,
    influenceRadius,
  );

  const co2eqMonetaryValueService = new CO2eqMonetaryValueService();

  const travelRelatedImpactsService = new TravelRelatedImpactsService(
    influenceAreaService,
    co2eqMonetaryValueService,
    buildingsFloorAreaDistribution.RESIDENTIAL ?? 0,
    0,
    buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0,
    evaluationPeriodInYears,
    operationsFirstYear,
  );

  const socioeconomic = [
    {
      actor: "human_society",
      amount: travelRelatedImpactsService.getAvoidedTrafficCO2EmissionsMonetaryValue(),
      impact: "avoided_traffic_co2_eq_emissions",
      impactCategory: "environmental_monetary",
    },
    {
      actor: "human_society",
      amount: travelRelatedImpactsService.getAvoidedAirPollution(),
      impact: "avoided_air_pollution",
      impactCategory: "environmental_monetary",
    },
    {
      actor: "local_residents",
      amount: travelRelatedImpactsService.getAvoidedKilometersPerResidentVehiculeMonetaryAmount(),
      impact: "avoided_car_related_expenses",
      impactCategory: "economic_indirect",
    },
    {
      actor: "local_workers",
      amount: travelRelatedImpactsService.getAvoidedKilometersPerWorkerVehiculeMonetaryAmount(),
      impact: "avoided_car_related_expenses",
      impactCategory: "economic_indirect",
    },
    {
      actor: "french_society",
      amount: travelRelatedImpactsService.getAvoidedPropertyDamageCosts(),
      impact: "avoided_property_damages_expenses",
      impactCategory: "economic_indirect",
    },
    {
      actor: "local_residents",
      amount: travelRelatedImpactsService.getTravelTimeSavedPerInhabitantTravelerMonetaryAmount(),
      impact: "travel_time_saved",
      impactCategory: "social_monetary",
    },
    {
      actor: "local_workers",
      amount: travelRelatedImpactsService.getTravelTimeSavedPerWorkerTravelerMonetaryAmount(),
      impact: "travel_time_saved",
      impactCategory: "social_monetary",
    },
    {
      actor: "french_society",
      amount: travelRelatedImpactsService.getAvoidedAccidentsInjuriesOrDeathsMonetaryValue(),
      impact: "avoided_traffic_accidents",
      impactCategory: "social_monetary",
      details: [
        {
          amount: travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesMonetaryValue(),
          impact: "avoided_traffic_minor_injuries",
        },
        {
          amount: travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue(),
          impact: "avoided_traffic_severe_injuries",
        },
        {
          amount: travelRelatedImpactsService.getAvoidedAccidentsDeathsMonetaryValue(),
          impact: "avoided_traffic_deaths",
        },
      ],
    },
  ];

  const avoidedTrafficAccidents = {
    total: travelRelatedImpactsService.getAvoidedAccidentsInjuriesOrDeaths(),
    minorInjuries: travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries(),
    severeInjuries: travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries(),
    deaths: travelRelatedImpactsService.getAvoidedAccidentsDeaths(),
  };

  return {
    socioeconomic: socioeconomic.filter(({ amount }) => amount > 0),
    avoidedVehiculeKilometers: travelRelatedImpactsService.getAvoidedKilometersPerVehicule(),
    travelTimeSaved: travelRelatedImpactsService.getTravelTimeSavedPerTraveler(),
    avoidedTrafficAccidents:
      avoidedTrafficAccidents.total > 0 ? avoidedTrafficAccidents : undefined,
    avoidedCarTrafficCo2EqEmissions:
      travelRelatedImpactsService.getAvoidedTrafficCO2EmissionsInTons(),
  };
};

type LocalPropertyInput = {
  evaluationPeriodInYears: number;
  siteIsFriche: boolean;
  siteSurfaceArea: number;
  siteCityCode: string;
  citySurfaceArea: number;
  cityPopulation: number;
  getCityRelatedDataService: GetCityRelatedDataService;
};

export const getLocalPropertyValueIncreaseRelatedImpacts = async ({
  evaluationPeriodInYears,
  siteSurfaceArea,
  siteIsFriche,
  siteCityCode,
  citySurfaceArea,
  cityPopulation,
  getCityRelatedDataService,
}: LocalPropertyInput) => {
  if (!siteIsFriche) {
    return [];
  }

  const cityPropertyValuePerSquareMeter =
    await getCityRelatedDataService.getPropertyValuePerSquareMeter(siteCityCode);

  const { propertyValueIncrease, propertyTransferDutiesIncrease } = computePropertyValueImpact(
    siteSurfaceArea,
    citySurfaceArea,
    cityPopulation,
    cityPropertyValuePerSquareMeter.medianPricePerSquareMeters,
    false, // TODO: quartier V2 créer une méthode de calcul pour ce paramètre
  );
  return [
    {
      actor: "local_residents",
      amount: propertyValueIncrease * evaluationPeriodInYears,
      impact: "local_property_value_increase",
      impactCategory: "economic_indirect",
    },
    {
      actor: "community",
      amount: propertyTransferDutiesIncrease * evaluationPeriodInYears,
      impact: "local_transfer_duties_increase",
      impactCategory: "economic_indirect",
    },
  ];
};

type Input = {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  features: MixedUseNeighbourhoodFeatures;
  siteSurfaceArea: number;
  siteIsFriche: boolean;
  siteCityCode: string;
  getCityRelatedDataService: GetCityRelatedDataService;
};

export const getMixedUseNeighbourhoodSpecificImpacts = async ({
  evaluationPeriodInYears,
  operationsFirstYear,
  features,
  siteSurfaceArea,
  siteIsFriche,
  siteCityCode,
  getCityRelatedDataService,
}: Input) => {
  const city = await getCityRelatedDataService.getCityPopulationAndSurfaceArea(siteCityCode);

  const { socioeconomic: urbanFreshnessSocioEconomicImpacts, ...urbanFreshnessImpacts } =
    getUrbanFreshnessRelatedImpacts({
      evaluationPeriodInYears,
      operationsFirstYear,
      features,
      siteSurfaceArea,
      citySurfaceArea: city.squareMetersSurfaceArea,
      cityPopulation: city.population,
    });

  const { socioeconomic: travelRelatedSocioEconomicImpacts, ...travelRelatedImpacts } =
    getTravelRelatedImpacts({
      evaluationPeriodInYears,
      operationsFirstYear,
      features,
      siteSurfaceArea,
      citySurfaceArea: city.squareMetersSurfaceArea,
      cityPopulation: city.population,
    });

  const localPropertyIncreaseRelatedImpacts = await getLocalPropertyValueIncreaseRelatedImpacts({
    evaluationPeriodInYears,
    siteSurfaceArea,
    siteIsFriche,
    siteCityCode,
    citySurfaceArea: city.squareMetersSurfaceArea,
    cityPopulation: city.population,
    getCityRelatedDataService,
  });

  return {
    socioeconomic: [
      ...urbanFreshnessSocioEconomicImpacts,
      ...travelRelatedSocioEconomicImpacts,
      ...localPropertyIncreaseRelatedImpacts,
    ] as MixedUseNeighbourhoodSocioEconomicSpecificImpact[],
    ...urbanFreshnessImpacts,
    ...travelRelatedImpacts,
  };
};
