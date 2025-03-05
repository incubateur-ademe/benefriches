import { Impact } from "../../impact";

type HouseholdsPoweredByRenewableEnergyImpactInput = {
  forecastRenewableEnergyAnnualProductionMWh: number;
};

const AVERAGE_HOUSEHOLD_ANNUAL_CONSUMPTION_KWH = 4679;
const MWH_TO_KWH_RATIO = 1000;

export const computeHouseholdsPoweredByRenewableEnergyImpact = (
  input: HouseholdsPoweredByRenewableEnergyImpactInput,
) => {
  const forecastRenewableEnergyAnnualProductionKWh =
    input.forecastRenewableEnergyAnnualProductionMWh * MWH_TO_KWH_RATIO;
  return Impact.get({
    base: 0,
    forecast: forecastRenewableEnergyAnnualProductionKWh / AVERAGE_HOUSEHOLD_ANNUAL_CONSUMPTION_KWH,
  });
};
