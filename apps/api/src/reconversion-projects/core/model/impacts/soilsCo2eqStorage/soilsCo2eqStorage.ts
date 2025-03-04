import { convertCarbonToCO2eq, roundTo2Digits } from "shared";

import { Impact } from "../impact";

export const computeSoilsCo2eqStorageImpact = (
  baseSoilsCarbonStorage?: number,
  forecastSoilsCarbonStorage?: number,
) => {
  if (!baseSoilsCarbonStorage || !forecastSoilsCarbonStorage) {
    return undefined;
  }
  return Impact.get({
    base: roundTo2Digits(convertCarbonToCO2eq(baseSoilsCarbonStorage)),
    forecast: roundTo2Digits(convertCarbonToCO2eq(forecastSoilsCarbonStorage)),
  });
};
