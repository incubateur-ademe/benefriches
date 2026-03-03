import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const soilsDecontaminationSurfaceAreaStepperConfig = {
  groupId: "SOILS_TRANSFORMATION",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
