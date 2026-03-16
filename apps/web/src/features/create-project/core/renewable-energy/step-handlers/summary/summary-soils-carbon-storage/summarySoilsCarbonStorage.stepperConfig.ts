import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const summarySoilsCarbonStorageStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
