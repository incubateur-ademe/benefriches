const RATIO_CO2_TO_CARBON = 12 / 44;

export const convertCarbonToCO2eq = (carbon: number) => {
  return carbon / RATIO_CO2_TO_CARBON;
};
