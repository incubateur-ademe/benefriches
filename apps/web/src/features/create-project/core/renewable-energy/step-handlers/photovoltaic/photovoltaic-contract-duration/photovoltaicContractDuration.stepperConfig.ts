import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const photovoltaicContractDurationStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
