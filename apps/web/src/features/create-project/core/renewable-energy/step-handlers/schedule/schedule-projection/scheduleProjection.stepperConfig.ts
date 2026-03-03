import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const scheduleProjectionStepperConfig = {
  groupId: "SCHEDULE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
