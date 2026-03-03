import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const photovoltaicKeyParameterStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
