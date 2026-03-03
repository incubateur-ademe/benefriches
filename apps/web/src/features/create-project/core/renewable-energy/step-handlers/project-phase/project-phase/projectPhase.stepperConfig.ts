import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const projectPhaseStepperConfig = {
  groupId: "PROJECT_PHASE",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
