import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const summarySoilsCarbonStorageStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
