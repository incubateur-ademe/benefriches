import type { RenewableEnergyStepStepperConfig } from "../../renewableEnergyStepperConfig";

export const photovoltaicPowerStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
  subGroupId: "PHOTOVOLTAIC_POWER",
} as const satisfies RenewableEnergyStepStepperConfig;
