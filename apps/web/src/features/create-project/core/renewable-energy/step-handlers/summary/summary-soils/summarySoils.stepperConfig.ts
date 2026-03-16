import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const summarySoilsStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
