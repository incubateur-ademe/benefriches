import type { RenewableEnergyStepStepperConfig } from "../../renewableEnergyStepperConfig";

export const photovoltaicContractDurationStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
  subGroupId: "PHOTOVOLTAIC_CONTRACT_DURATION",
} as const satisfies RenewableEnergyStepStepperConfig;
