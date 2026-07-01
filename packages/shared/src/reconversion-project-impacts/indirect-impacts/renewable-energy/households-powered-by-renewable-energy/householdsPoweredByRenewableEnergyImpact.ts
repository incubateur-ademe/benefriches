import { roundToInteger } from "../../../../services";

type HouseholdsPoweredByRenewableEnergyImpactInput = {
  forecastRenewableEnergyAnnualProductionMWh: number;
};

const AVERAGE_HOUSEHOLD_ANNUAL_CONSUMPTION_KWH = 4890.6;
const MWH_TO_KWH_RATIO = 1000;

export const computeHouseholdsPoweredByRenewableEnergyImpact = (
  input: HouseholdsPoweredByRenewableEnergyImpactInput,
) => {
  const forecastRenewableEnergyAnnualProductionKWh =
    input.forecastRenewableEnergyAnnualProductionMWh * MWH_TO_KWH_RATIO;
  return roundToInteger(
    forecastRenewableEnergyAnnualProductionKWh / AVERAGE_HOUSEHOLD_ANNUAL_CONSUMPTION_KWH,
  );
};
