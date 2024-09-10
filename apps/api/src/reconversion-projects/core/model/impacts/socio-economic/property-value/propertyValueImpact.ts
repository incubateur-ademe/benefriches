import { TRANSFER_TAX_PERCENT_PER_TRANSACTION } from "shared";
import { GetInfluenceAreaValuesService } from "../../services/GetInfluenceAreaValuesService";

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
    const influenceAreaService = new GetInfluenceAreaValuesService(
      siteSurfaceArea,
      citySurfaceArea,
      cityPopulation,
      radius,
    );

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
