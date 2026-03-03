import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const revenueFinancialAssistanceStepperConfig = {
  groupId: "EXPENSES_AND_REVENUE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
