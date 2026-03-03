import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsTransformationCustomSoilsSelectionStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
