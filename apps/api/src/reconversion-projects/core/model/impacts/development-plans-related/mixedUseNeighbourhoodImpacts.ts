import { MixedUseNeighbourhoodFeatures } from "../../mixedUseNeighbourhood";
import { CO2eqMonetaryValueService } from "../services/CO2eqMonetaryValueService";
import { GetInfluenceAreaValuesService } from "../services/GetInfluenceAreaValuesService";
import { TravelRelatedImpactsService } from "../services/TravelRelatedImpactsService";
import { UrbanFreshnessRelatedImpactsService } from "../services/UrbanFreshnessRelatedImpactsService";

export type MixedUseNeighbourhoodSocioEconomicSpecificImpact =
  | AvoidedCarRelatedExpensesImpact
  | AvoidedAirConditioningExpensesImpact
  | TravelTimeSavedImpact
  | AvoidedTrafficAccidentsImpact
  | AvoidedTrafficCO2EqEmissions
  | AvoidedAirConditioningCO2EqEmissions
  | AvoidedAirPollutionImpact;

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
  actor: "french_society";
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

type Input = {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  features: MixedUseNeighbourhoodFeatures;
  siteSurfaceArea: number;
  citySurfaceArea: number;
  cityPopulation: number;
};

const getUrbanFreshnessInfluenceRadius = (
  siteSurfaceArea: number,
  publicGreenSpaceSurface: number,
) => {
  const publicGreenSpaceSurfaceRatio = publicGreenSpaceSurface / siteSurfaceArea;

  const highRatio = siteSurfaceArea > 10000 ? 0.8 : 0.95;
  const lowRatio = siteSurfaceArea > 10000 ? 0.3 : 0.5;
  if (publicGreenSpaceSurfaceRatio > highRatio) {
    return 500;
  }
  if (publicGreenSpaceSurfaceRatio > lowRatio) {
    return 200;
  }
  return 0;
};

export const getUrbanFreshnessRelatedImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  features,
  siteSurfaceArea,
  citySurfaceArea,
  cityPopulation,
}: Input) => {
  const { buildingsFloorAreaDistribution, spacesDistribution } = features;

  if (!spacesDistribution.PUBLIC_GREEN_SPACES || spacesDistribution.PUBLIC_GREEN_SPACES === 0) {
    return { socioeconomic: [] };
  }

  const influenceRadius = getUrbanFreshnessInfluenceRadius(
    siteSurfaceArea,
    spacesDistribution.PUBLIC_GREEN_SPACES,
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

export const getTravelRelatedImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  features,
  siteSurfaceArea,
  citySurfaceArea,
  cityPopulation,
}: Input) => {
  const { buildingsFloorAreaDistribution } = features;

  const influenceAreaService = new GetInfluenceAreaValuesService(
    siteSurfaceArea,
    citySurfaceArea,
    cityPopulation,
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
      amount: travelRelatedImpactsService.getTravelTimeSavedPerTravelerMonetaryAmount(),
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

export const getMixedUseNeighbourhoodSpecificImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  features,
  siteSurfaceArea,
  citySurfaceArea,
  cityPopulation,
}: Input) => {
  const { socioeconomic: urbanFreshnessSocioEconomicImpacts, ...urbanFreshnessImpacts } =
    getUrbanFreshnessRelatedImpacts({
      evaluationPeriodInYears,
      operationsFirstYear,
      features,
      siteSurfaceArea,
      citySurfaceArea,
      cityPopulation,
    });

  const { socioeconomic: travelRelatedSocioEconomicImpacts, ...travelRelatedImpacts } =
    getTravelRelatedImpacts({
      evaluationPeriodInYears,
      operationsFirstYear,
      features,
      siteSurfaceArea,
      citySurfaceArea,
      cityPopulation,
    });

  return {
    socioeconomic: [
      ...urbanFreshnessSocioEconomicImpacts,
      ...travelRelatedSocioEconomicImpacts,
    ] as MixedUseNeighbourhoodSocioEconomicSpecificImpact[],
    ...urbanFreshnessImpacts,
    ...travelRelatedImpacts,
  };
};
