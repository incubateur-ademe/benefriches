import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsTransformationIntroductionStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
