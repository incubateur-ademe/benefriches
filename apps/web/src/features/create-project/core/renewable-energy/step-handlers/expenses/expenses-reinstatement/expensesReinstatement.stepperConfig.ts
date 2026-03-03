import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const expensesReinstatementStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
