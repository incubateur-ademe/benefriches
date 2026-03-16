import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsTransformationIntroductionStepperConfig = {
  groupId: "SITE_WORKS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
