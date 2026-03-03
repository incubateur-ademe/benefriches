import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const summarySoilsStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
