import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsDecontaminationSelectionStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
