import type { RenewableEnergyStepGroupId } from "../../renewableEnergyStepperConfig";

export const photovoltaicExpectedAnnualProductionStepperConfig = {
  groupId: "PHOTOVOLTAIC_PARAMETERS",
} as const satisfies { groupId: RenewableEnergyStepGroupId };
