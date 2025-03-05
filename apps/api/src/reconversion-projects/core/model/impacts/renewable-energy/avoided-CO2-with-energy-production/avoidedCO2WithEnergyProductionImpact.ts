type AvoidedCO2WithEnergyProductionImpactInput = {
  forecastAnnualEnergyProductionMWh: number;
};

const AVERAGE_FRENCH_ENERGY_PRODUCTION_CO2_GRAMS_PER_KWH = 79;

const PHOTOVOLTAIC_FRENCH_ENERGY_PRODUCTION_CO2_GRAMS_PER_KWH = 55;

const GRAMS_TO_TONS_RATIO = 0.000001;

export const computeAvoidedCO2TonsWithEnergyProductionImpact = (
  input: AvoidedCO2WithEnergyProductionImpactInput,
): number => {
  const forecastAnnualEnergyProductionKWh = input.forecastAnnualEnergyProductionMWh * 1000;

  const resultInGrams =
    forecastAnnualEnergyProductionKWh *
    (AVERAGE_FRENCH_ENERGY_PRODUCTION_CO2_GRAMS_PER_KWH -
      PHOTOVOLTAIC_FRENCH_ENERGY_PRODUCTION_CO2_GRAMS_PER_KWH);

  return resultInGrams * GRAMS_TO_TONS_RATIO;
};
