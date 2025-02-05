import {
  LocalHousingPropertyValueIncreaseImpact,
  LocalTransferDutiesIncreaseImpact,
  TRANSFER_TAX_PERCENT_PER_TRANSACTION,
} from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import { InfluenceAreaService } from "../influence-area-service/InfluenceAreaService";

const FRICHE_REMOVAL_PRICE_RISES = [
  {
    radius: 100,
    ratio: 0.035,
  },
  {
    radius: 200,
    ratio: 0.03,
  },
];

const FRICHE_REMOVAL_AND_RENATURATION_PRICE_RISES = [
  {
    radius: 100,
    ratio: 0.05,
  },
  {
    radius: 200,
    ratio: 0.04,
  },
  {
    radius: 300,
    ratio: 0.03,
  },
  {
    radius: 400,
    ratio: 0.02,
  },
  {
    radius: 500,
    ratio: 0.01,
  },
];

const SOCIAL_HOUSING_SHARE = 0.2;
const AVERAGE_HOUSE_HOLDING_PERIOD = 33;

export const computePropertyValueImpact = (
  siteSurfaceArea: number,
  citySurfaceArea: number,
  cityPopulation: number,
  localHousePriceEuroPerSquareMeters: number,
  evaluationPeriodInYears: number,
  isRenaturation = false,
) => {
  const influenceZonesHousePriceRises = (
    isRenaturation ? FRICHE_REMOVAL_AND_RENATURATION_PRICE_RISES : FRICHE_REMOVAL_PRICE_RISES
  ).map(({ radius, ratio }) => {
    const influenceAreaService = new InfluenceAreaService({
      siteSquareMetersSurfaceArea: siteSurfaceArea,
      citySquareMetersSurfaceArea: citySurfaceArea,
      cityPopulation,
      influenceRadius: radius,
    });

    const currentHousePriceInZone =
      influenceAreaService.getInfluenceAreaSquareMetersHousingSurface() *
      localHousePriceEuroPerSquareMeters;

    return currentHousePriceInZone - currentHousePriceInZone * (1 - ratio);
  }, 0);

  const totalHousePriceRise = influenceZonesHousePriceRises.reduce((total, value) => total + value);

  const propertyValueIncreaseForOneYear = (totalHousePriceRise * (1 - SOCIAL_HOUSING_SHARE)) / 5;
  const propertyValueIncreaseDurationInYears =
    evaluationPeriodInYears > 5 ? 5 : evaluationPeriodInYears;

  const propertyTransferDutiesIncreaseForOneYear =
    (totalHousePriceRise / AVERAGE_HOUSE_HOLDING_PERIOD) *
    TRANSFER_TAX_PERCENT_PER_TRANSACTION *
    (1 - SOCIAL_HOUSING_SHARE);

  const propertyTransferDutiesIncreaseDurationInYears =
    evaluationPeriodInYears > 33 ? 33 : evaluationPeriodInYears;

  return {
    propertyValueIncrease: propertyValueIncreaseForOneYear * propertyValueIncreaseDurationInYears,
    propertyTransferDutiesIncrease:
      propertyTransferDutiesIncreaseForOneYear * propertyTransferDutiesIncreaseDurationInYears,
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

type LocalPropertyResult =
  | [LocalHousingPropertyValueIncreaseImpact, LocalTransferDutiesIncreaseImpact]
  | [];
export const getLocalPropertyValueIncreaseRelatedImpacts = async ({
  evaluationPeriodInYears,
  siteSurfaceArea,
  siteIsFriche,
  siteCityCode,
  citySurfaceArea,
  cityPopulation,
  getCityRelatedDataService,
}: LocalPropertyInput): Promise<LocalPropertyResult> => {
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
    evaluationPeriodInYears,
    false, // TODO: quartier V2 créer une méthode de calcul pour ce paramètre
  );
  return [
    {
      actor: "local_people",
      amount: propertyValueIncrease,
      impact: "local_property_value_increase",
      impactCategory: "economic_indirect",
    },
    {
      actor: "community",
      amount: propertyTransferDutiesIncrease,
      impact: "local_transfer_duties_increase",
      impactCategory: "economic_indirect",
    },
  ];
};
