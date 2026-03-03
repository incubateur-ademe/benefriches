import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const summaryCreationResultStepperConfig = {
  groupId: "SUMMARY",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
