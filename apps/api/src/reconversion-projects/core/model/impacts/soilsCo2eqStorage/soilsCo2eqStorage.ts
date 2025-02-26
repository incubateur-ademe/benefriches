import { convertCarbonToCO2eq, roundTo2Digits } from "shared";

export const computeSoilsCo2eqStorageImpact = (
  baseSoilsCarbonStorage?: number,
  forecastSoilsCarbonStorage?: number,
) => {
  if (!baseSoilsCarbonStorage || !forecastSoilsCarbonStorage) {
    return undefined;
  }

  const base = roundTo2Digits(convertCarbonToCO2eq(baseSoilsCarbonStorage));
  const forecast = roundTo2Digits(convertCarbonToCO2eq(forecastSoilsCarbonStorage));
  return {
    base,
    forecast,
    difference: forecast - base,
  };
};
