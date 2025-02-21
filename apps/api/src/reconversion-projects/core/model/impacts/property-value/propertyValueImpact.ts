import { TRANSFER_TAX_PERCENT_PER_TRANSACTION } from "shared";

import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
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
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService,
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

  const propertyTransferDutiesIncreaseForOneYear =
    (totalHousePriceRise / AVERAGE_HOUSE_HOLDING_PERIOD) *
    TRANSFER_TAX_PERCENT_PER_TRANSACTION *
    (1 - SOCIAL_HOUSING_SHARE);

  return {
    propertyValueIncrease: sumOnEvolutionPeriodService.sumWithDiscountFactor(
      propertyValueIncreaseForOneYear,
      { rangeIndex: [1, 6] },
    ),
    propertyTransferDutiesIncrease: sumOnEvolutionPeriodService.sumWithDiscountFactor(
      propertyTransferDutiesIncreaseForOneYear,
      { rangeIndex: [1, 34] },
    ),
  };
};
