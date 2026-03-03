import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsTransformationNonSuitableSoilsSelectionStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
