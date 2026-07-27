import type { RenewableEnergyStepStepperConfig } from "../../renewableEnergyStepperConfig";

export const photovoltaicExpectedAnnualProductionStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
  subGroupId: "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
} as const satisfies RenewableEnergyStepStepperConfig;
