import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsTransformationProjectSelectionStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
