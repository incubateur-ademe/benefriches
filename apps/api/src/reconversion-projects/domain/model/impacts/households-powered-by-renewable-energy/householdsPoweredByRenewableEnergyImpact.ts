type HouseholdsPoweredByRenewableEnergyImpactInput = {
  forecastRenewableEnergyAnnualProductionMWh: number;
};

export type HouseholdsPoweredByRenewableEnergyImpact = {
  current: number;
  forecast: number;
};

const AVERAGE_HOUSEHOLD_ANNUAL_CONSUMPTION_KWH = 4679;
const MWH_TO_KWH_RATIO = 1000;

export const computeHouseholdsPoweredByRenewableEnergyImpact = (
  input: HouseholdsPoweredByRenewableEnergyImpactInput,
): HouseholdsPoweredByRenewableEnergyImpact => {
  const forecastRenewableEnergyAnnualProductionKWh =
    input.forecastRenewableEnergyAnnualProductionMWh * MWH_TO_KWH_RATIO;
  return {
    current: 0,
    forecast: forecastRenewableEnergyAnnualProductionKWh / AVERAGE_HOUSEHOLD_ANNUAL_CONSUMPTION_KWH,
  };
};
