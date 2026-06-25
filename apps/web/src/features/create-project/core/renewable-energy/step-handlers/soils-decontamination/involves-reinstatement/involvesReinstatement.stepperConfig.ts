import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const involvesReinstatementStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
