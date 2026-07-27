import type { RenewableEnergyStepStepperConfig } from "../../renewableEnergyStepperConfig";

export const photovoltaicSurfaceStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
  subGroupId: "PHOTOVOLTAIC_SURFACE",
} as const satisfies RenewableEnergyStepStepperConfig;
