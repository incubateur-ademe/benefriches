import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const expensesSitePurchaseAmountsStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
