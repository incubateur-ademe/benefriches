import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const expensesIntroductionStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
