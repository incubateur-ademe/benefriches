import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const photovoltaicPowerStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
