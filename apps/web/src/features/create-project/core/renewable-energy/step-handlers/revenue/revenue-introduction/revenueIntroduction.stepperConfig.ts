import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const revenueIntroductionStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
