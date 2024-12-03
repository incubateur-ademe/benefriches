import { TRANSFER_TAX_PERCENT_PER_TRANSACTION } from "shared";

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

  return {
    propertyValueIncrease: totalHousePriceRise * (1 - SOCIAL_HOUSING_SHARE),
    propertyTransferDutiesIncrease:
      (totalHousePriceRise / AVERAGE_HOUSE_HOLDING_PERIOD) *
      TRANSFER_TAX_PERCENT_PER_TRANSACTION *
      (1 - SOCIAL_HOUSING_SHARE),
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
