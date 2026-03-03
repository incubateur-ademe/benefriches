import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const expensesInstallationStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
