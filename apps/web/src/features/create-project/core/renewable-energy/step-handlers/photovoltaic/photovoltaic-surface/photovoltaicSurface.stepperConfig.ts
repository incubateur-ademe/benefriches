import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const photovoltaicSurfaceStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
