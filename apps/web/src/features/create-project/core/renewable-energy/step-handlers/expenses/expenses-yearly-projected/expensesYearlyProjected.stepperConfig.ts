import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const expensesYearlyProjectedStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
