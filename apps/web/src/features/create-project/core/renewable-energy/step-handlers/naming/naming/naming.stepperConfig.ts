import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const namingStepperConfig = {
  groupId: "NAMING",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
