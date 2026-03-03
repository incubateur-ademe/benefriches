import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const stakeholdersSitePurchaseStepperConfig = {
  groupId: "STAKEHOLDERS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
