import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsDecontaminationIntroductionStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
