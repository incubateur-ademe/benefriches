import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsDecontaminationIntroductionStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
