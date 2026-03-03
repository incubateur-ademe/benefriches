import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const summaryFinalStepperConfig = {
  groupId: "SUMMARY",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
