import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsDecontaminationSelectionStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
